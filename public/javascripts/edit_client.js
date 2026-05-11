let currentClientId = null;

document.addEventListener("DOMContentLoaded", () => {
  configurarMenu();
  configurarLogout();
  configurarMascaras();
  configurarSenhas();
  configurarFormulario();
  carregarCliente();
});

async function carregarCliente() {
  const urlParams = new URLSearchParams(window.location.search);
  const clientId = urlParams.get("id");

  if (!clientId) {
    mostrarFeedback("error", "Cliente não informado na URL.");
    return;
  }

  currentClientId = clientId;
  mostrarFeedback("info", "Carregando dados do cliente...");

  try {
    const response = await fetch(`/clients/${clientId}`);
    if (!response.ok) throw new Error("Cliente não encontrado.");

    const client = await response.json();
    if (!client) throw new Error("Cliente não encontrado.");

    preencherFormulario(client);
    mostrarFeedback("success", "Dados carregados. Faça os ajustes necessários e salve.");
  } catch (error) {
    mostrarFeedback("error", `Erro ao carregar dados do cliente: ${error.message}`);
  }
}

function preencherFormulario(client) {
  currentClientId = client.id;

  setValue("client-id", client.id);
  setValue("empresa", client.empresa);
  setValue("operadora", client.operadora);
  setValue("plano", client.plano);
  setValue("apolice", client.apolice);
  setValue("valor", formatarMoedaValorSalvo(client.valor));
  setValue("responsavel", client.responsavel);
  setValue("vencimento", client.vencimento);
  setValue("vidas", client.vidas);
  setValue("phone", formatarTelefone(client.phone));
  setValue("email", client.email);
  setValue("senha_email", client.senha_email);
  setValue("mes_reajuste", client.mes_reajuste);
  setValue("login_portal", client.login_portal);
  setValue("senha_portal", client.senha_portal);
  setValue("cnpj_cliente", formatarCnpj(client.cnpj_cliente));
  setValue("plataforma", client.plataforma);

  const title = document.getElementById("client-title");
  if (title) title.textContent = client.empresa || "Edite os dados do cliente selecionado.";
}

function configurarFormulario() {
  const form = document.getElementById("edit-client-form");
  const submitButton = document.getElementById("submitButton");

  if (!form || !submitButton) return;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!validarFormulario(form)) return;

    const id = document.getElementById("client-id")?.value || currentClientId;
    if (!id) {
      mostrarFeedback("error", "Não foi possível identificar o cliente para salvar.");
      return;
    }

    const payload = montarPayload(form);
    definirCarregando(submitButton, true);
    mostrarFeedback("info", "Salvando alterações...");

    try {
      const response = await fetch(`/clients/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Erro desconhecido ao atualizar cliente.");
      }

      mostrarFeedback("success", result.message || "Cliente atualizado com sucesso.");
      setTimeout(() => {
        window.location.href = "list_clients.html";
      }, 700);
    } catch (error) {
      mostrarFeedback("error", `Falha ao atualizar cliente: ${error.message}`);
    } finally {
      definirCarregando(submitButton, false);
    }
  });
}

function validarFormulario(form) {
  const vencimento = Number(form.vencimento.value);

  if (!form.checkValidity()) {
    form.reportValidity();
    return false;
  }

  if (vencimento < 1 || vencimento > 31) {
    mostrarFeedback("error", "O vencimento do boleto deve ser um dia entre 1 e 31.");
    form.vencimento.focus();
    return false;
  }

  return true;
}

function montarPayload(form) {
  const formData = new FormData(form);
  const payload = Object.fromEntries(formData.entries());

  delete payload.id;

  payload.valor = normalizarMoeda(payload.valor);
  payload.vencimento = Number(payload.vencimento);
  payload.vidas = payload.vidas ? Number(payload.vidas) : "";
  payload.mes_reajuste = Number(payload.mes_reajuste);

  return payload;
}

function configurarMenu() {
  const menuToggle = document.getElementById("menuToggle");
  const sidebar = document.getElementById("sidebar");
  const overlay = document.getElementById("sidebarOverlay");

  if (!menuToggle || !sidebar || !overlay) return;

  const fecharMenu = () => {
    sidebar.classList.add("-translate-x-full");
    overlay.classList.add("hidden");
    document.body.classList.remove("overflow-hidden");
  };

  const alternarMenu = () => {
    sidebar.classList.toggle("-translate-x-full");
    overlay.classList.toggle("hidden");
    document.body.classList.toggle("overflow-hidden");
  };

  menuToggle.addEventListener("click", alternarMenu);
  overlay.addEventListener("click", fecharMenu);

  sidebar.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", fecharMenu);
  });
}

function configurarLogout() {
  const logoutButton = document.getElementById("logoutButton");
  if (!logoutButton) return;

  logoutButton.addEventListener("click", () => {
    window.location.href = "index.html";
  });
}

function configurarMascaras() {
  const cnpj = document.getElementById("cnpj_cliente");
  const phone = document.getElementById("phone");
  const valor = document.getElementById("valor");

  if (cnpj) {
    cnpj.addEventListener("input", () => {
      cnpj.value = formatarCnpj(cnpj.value);
    });
  }

  if (phone) {
    phone.addEventListener("input", () => {
      phone.value = formatarTelefone(phone.value);
    });
  }

  if (valor) {
    valor.addEventListener("input", () => {
      valor.value = formatarMoeda(valor.value);
    });
  }
}

function configurarSenhas() {
  document.querySelectorAll(".password-toggle").forEach((button) => {
    button.addEventListener("click", () => {
      const input = document.getElementById(button.dataset.target);
      const icon = button.querySelector("i");
      if (!input || !icon) return;

      const mostrar = input.type === "password";
      input.type = mostrar ? "text" : "password";
      icon.classList.toggle("fa-eye", !mostrar);
      icon.classList.toggle("fa-eye-slash", mostrar);
    });
  });
}

function definirCarregando(button, carregando) {
  button.disabled = carregando;
  button.innerHTML = carregando
    ? '<i class="fas fa-spinner fa-spin"></i> Salvando...'
    : '<i class="fas fa-floppy-disk"></i> Salvar alterações';
}

function mostrarFeedback(tipo, mensagem) {
  const feedback = document.getElementById("formFeedback");
  if (!feedback) return;

  const estilos = {
    success: "border-emerald-200 bg-emerald-50 text-emerald-800",
    error: "border-rose-200 bg-rose-50 text-rose-800",
    info: "border-sky-200 bg-sky-50 text-sky-800"
  };

  feedback.className = `mb-6 rounded-lg border p-4 text-sm ${estilos[tipo] || estilos.info}`;
  feedback.textContent = mensagem;
  feedback.classList.remove("hidden");
}

function setValue(id, value) {
  const element = document.getElementById(id);
  if (element) element.value = value ?? "";
}

function apenasNumeros(valor) {
  return String(valor || "").replace(/\D/g, "");
}

function formatarCnpj(valor) {
  return apenasNumeros(valor)
    .slice(0, 14)
    .replace(/^(\d{2})(\d)/, "$1.$2")
    .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1/$2")
    .replace(/(\d{4})(\d)/, "$1-$2");
}

function formatarTelefone(valor) {
  const numeros = apenasNumeros(valor).slice(0, 11);

  if (numeros.length <= 10) {
    return numeros
      .replace(/^(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{4})(\d)/, "$1-$2");
  }

  return numeros
    .replace(/^(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d)/, "$1-$2");
}

function formatarMoeda(valor) {
  const numeros = apenasNumeros(valor);
  if (!numeros) return "";

  const stringValue = String(valor || "");
  const hasDecimalSeparator = /[,.]\d{1,2}$/.test(stringValue);
  const numero = hasDecimalSeparator ? Number(stringValue.replace(/\./g, "").replace(",", ".")) : Number(numeros) / 100;

  if (Number.isNaN(numero)) return "";

  return numero.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });
}

function formatarMoedaValorSalvo(valor) {
  if (valor === null || valor === undefined || valor === "") return "";

  const numero = Number(valor);
  if (Number.isNaN(numero)) return formatarMoeda(valor);

  return numero.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });
}

function normalizarMoeda(valor) {
  const numeros = apenasNumeros(valor);
  if (!numeros) return "";

  return (Number(numeros) / 100).toFixed(2);
}
