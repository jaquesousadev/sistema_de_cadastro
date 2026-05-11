document.addEventListener("DOMContentLoaded", () => {
  configurarMenu();
  configurarLogout();
  configurarMascaras();
  configurarSenhas();
  configurarFormulario();
});

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

function configurarFormulario() {
  const form = document.getElementById("register-client-form");
  const submitButton = document.getElementById("submitButton");

  if (!form || !submitButton) return;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!validarFormulario(form)) return;

    const payload = montarPayload(form);
    definirCarregando(submitButton, true);
    mostrarFeedback("info", "Salvando cliente...");

    try {
      const response = await fetch("/clients/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Erro desconhecido ao registrar cliente.");
      }

      mostrarFeedback("success", result.message || "Cliente registrado com sucesso.");
      form.reset();
      document.getElementById("empresa")?.focus();
    } catch (error) {
      mostrarFeedback("error", `Falha no registro: ${error.message}`);
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

  payload.valor = normalizarMoeda(payload.valor);
  payload.vencimento = Number(payload.vencimento);
  payload.vidas = payload.vidas ? Number(payload.vidas) : "";
  payload.mes_reajuste = Number(payload.mes_reajuste);

  return payload;
}

function definirCarregando(button, carregando) {
  button.disabled = carregando;
  button.innerHTML = carregando
    ? '<i class="fas fa-spinner fa-spin"></i> Salvando...'
    : '<i class="fas fa-floppy-disk"></i> Salvar cliente';
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
  feedback.scrollIntoView({ behavior: "smooth", block: "nearest" });
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

  const numero = Number(numeros) / 100;

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
