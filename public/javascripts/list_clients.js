let clientsData = [];
let clientToDelete = null;

document.addEventListener("DOMContentLoaded", () => {
  configurarMenu();
  configurarLogout();
  configurarBusca();
  configurarModalExclusao();
  configurarModalAcessos();
  fetchClients();
});

async function fetchClients() {
  setState("loading", "Carregando clientes...");

  try {
    const response = await fetch("/clients");
    if (!response.ok) throw new Error("Erro ao buscar clientes.");

    const data = await response.json();
    clientsData = Array.isArray(data.clients) ? data.clients : [];

    atualizarContadores(clientsData.length, clientsData.length);
    displayClients(clientsData);
  } catch (error) {
    setState("error", `Falha ao carregar a lista de clientes: ${error.message}`);
  }
}

function displayClients(clients) {
  const clientList = document.getElementById("client-list");
  const tableWrapper = document.getElementById("client-table-wrapper");
  const state = document.getElementById("client-state");

  if (!clientList || !tableWrapper || !state) return;

  clientList.innerHTML = "";
  atualizarContadores(clientsData.length, clients.length);

  if (clients.length === 0) {
    tableWrapper.classList.add("hidden");
    setState("empty", "Nenhum cliente encontrado.");
    return;
  }

  state.classList.add("hidden");
  tableWrapper.classList.remove("hidden");

  clients.forEach((client) => {
    const row = document.createElement("tr");
    row.className = "align-top transition hover:bg-slate-50";
    const portalLink = normalizarLinkPortal(client.link_portal);

    row.innerHTML = `
      <td class="px-5 py-4">
        <div class="max-w-xs">
          <p class="font-semibold text-slate-950">${escapeHtml(client.empresa || "-")}</p>
          <p class="mt-1 text-xs text-slate-500">${escapeHtml(client.cnpj_cliente || "CNPJ nao informado")}</p>
        </div>
      </td>
      <td class="px-5 py-4 text-sm text-slate-700">
        <p>${escapeHtml(client.responsavel || "-")}</p>
        <div class="mt-2">${renderStatusEmpresa(client.status_empresa)}</div>
      </td>
      <td class="px-5 py-4 text-sm text-slate-700">
        <p>${escapeHtml(client.operadora || "-")}</p>
        <p class="mt-1 text-xs text-slate-500">${escapeHtml(client.plano || "")}</p>
      </td>
      <td class="px-5 py-4 text-sm text-slate-700">
        ${formatarDiaVencimento(client.vencimento)}
      </td>
      <td class="px-5 py-4 text-sm text-slate-700">
        ${formatarMes(client.mes_reajuste)}
        <div class="mt-2">${renderStatusBoleto(client.status_boleto)}</div>
      </td>
      <td class="px-5 py-4 text-sm text-slate-700">
        <p class="font-medium">${escapeHtml(client.plataforma || "-")}</p>
        <p class="mt-1 text-xs text-slate-500">${portalLink ? "Portal cadastrado" : "Portal nao informado"}</p>
        <div class="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            class="inline-flex items-center gap-2 rounded-lg bg-slate-950 px-2 py-1 text-xs font-semibold text-white transition hover:bg-slate-800"
            onclick="openAccessModal(${Number(client.id)})"
          >
            <i class="fas fa-key"></i>
            Login
          </button>
        </div>
      </td>
      <td class="sticky right-0 z-10 min-w-28 bg-white px-5 py-4 text-right shadow-[-8px_0_12px_-12px_rgba(15,23,42,0.45)]">
        <div class="flex justify-end gap-2">
          <button
            type="button"
            class="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-100"
            onclick="editClient(${Number(client.id)})"
            title="Editar cliente"
            aria-label="Editar cliente"
          >
            <i class="fas fa-pen"></i>
          </button>
          <button
            type="button"
            class="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-rose-200 bg-white text-rose-600 transition hover:bg-rose-50"
            onclick="openDeleteModal(${Number(client.id)})"
            title="Excluir cliente"
            aria-label="Excluir cliente"
          >
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </td>
    `;

    clientList.appendChild(row);
  });
}

function configurarBusca() {
  const searchInput = document.getElementById("search-input");
  const clearSearch = document.getElementById("clear-search");

  if (!searchInput || !clearSearch) return;

  searchInput.addEventListener("input", () => {
    clearSearch.classList.toggle("hidden", searchInput.value.trim() === "");
    clearSearch.classList.toggle("inline-flex", searchInput.value.trim() !== "");
    filterClients();
  });

  clearSearch.addEventListener("click", () => {
    searchInput.value = "";
    clearSearch.classList.add("hidden");
    clearSearch.classList.remove("inline-flex");
    displayClients(clientsData);
    searchInput.focus();
  });
}

function filterClients() {
  const searchInput = document.getElementById("search-input");
  const term = normalizarTexto(searchInput?.value || "");

  if (!term) {
    displayClients(clientsData);
    return;
  }

  const filteredClients = clientsData.filter((client) => {
    return [
      client.empresa,
      client.responsavel,
      client.status_empresa,
      client.operadora,
      client.cnpj_cliente,
      client.plataforma,
      client.email,
      client.link_portal,
      client.login_portal,
      client.status_boleto,
      client.observacoes_boleto
    ].some((value) => normalizarTexto(value).includes(term));
  });

  displayClients(filteredClients);
}

function configurarModalAcessos() {
  const modal = document.getElementById("access-modal");
  const closeButton = document.getElementById("close-access");
  const copyLoginButton = document.getElementById("copy-login");
  const copyPasswordButton = document.getElementById("copy-password");

  if (!modal || !closeButton || !copyLoginButton || !copyPasswordButton) return;

  closeButton.addEventListener("click", closeAccessModal);
  modal.addEventListener("click", (event) => {
    if (event.target === modal) closeAccessModal();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !modal.classList.contains("hidden")) {
      closeAccessModal();
    }
  });

  copyLoginButton.addEventListener("click", () => {
    copyToClipboard(copyLoginButton.dataset.value || "", "Login copiado.");
  });

  copyPasswordButton.addEventListener("click", () => {
    copyToClipboard(copyPasswordButton.dataset.value || "", "Senha copiada.");
  });
}

function openAccessModal(id) {
  const modal = document.getElementById("access-modal");
  const client = clientsData.find((item) => Number(item.id) === Number(id));

  if (!modal || !client) return;

  const portalLink = normalizarLinkPortal(client.link_portal);
  const openPortal = document.getElementById("open-portal");
  const copyLoginButton = document.getElementById("copy-login");
  const copyPasswordButton = document.getElementById("copy-password");

  setText("access-modal-title", client.empresa || "Acessos do cliente");
  setText("access-modal-subtitle", client.email || "Dados de login e portal.");
  setText("access-platform", client.plataforma || "-");
  setText("access-login", client.login_portal || "Login nao informado");
  setText("access-password", client.senha_portal || "Senha nao informada");
  setText("access-portal", portalLink || "Portal nao informado");
  setText("access-notes", client.observacoes_boleto || "Sem observacoes.");

  if (copyLoginButton) copyLoginButton.dataset.value = client.login_portal || "";
  if (copyPasswordButton) copyPasswordButton.dataset.value = client.senha_portal || "";

  if (openPortal) {
    if (portalLink) {
      openPortal.href = portalLink;
      openPortal.classList.remove("hidden");
      openPortal.classList.add("inline-flex");
    } else {
      openPortal.href = "#";
      openPortal.classList.add("hidden");
      openPortal.classList.remove("inline-flex");
    }
  }

  modal.classList.remove("hidden");
  modal.classList.add("flex");
}

function closeAccessModal() {
  const modal = document.getElementById("access-modal");
  if (!modal) return;

  modal.classList.add("hidden");
  modal.classList.remove("flex");
}

function configurarModalExclusao() {
  const modal = document.getElementById("delete-modal");
  const cancelButton = document.getElementById("cancel-delete");
  const confirmButton = document.getElementById("confirm-delete");

  if (!modal || !cancelButton || !confirmButton) return;

  cancelButton.addEventListener("click", closeDeleteModal);
  modal.addEventListener("click", (event) => {
    if (event.target === modal) closeDeleteModal();
  });

  confirmButton.addEventListener("click", async () => {
    if (!clientToDelete) return;

    confirmButton.disabled = true;
    confirmButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Excluindo...';

    try {
      const response = await fetch(`/clients/${clientToDelete.id}`, { method: "DELETE" });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Erro desconhecido ao excluir cliente.");
      }

      mostrarFeedback("success", "Cliente excluido com sucesso.");
      closeDeleteModal();
      await fetchClients();
    } catch (error) {
      mostrarFeedback("error", `Falha ao excluir cliente: ${error.message}`);
    } finally {
      confirmButton.disabled = false;
      confirmButton.textContent = "Excluir";
    }
  });
}

function openDeleteModal(id) {
  const modal = document.getElementById("delete-modal");
  const text = document.getElementById("delete-modal-text");
  const client = clientsData.find((item) => Number(item.id) === Number(id));

  if (!modal || !text || !client) return;

  clientToDelete = client;
  text.textContent = `Tem certeza que deseja excluir "${client.empresa}"? Esta acao nao pode ser desfeita.`;
  modal.classList.remove("hidden");
  modal.classList.add("flex");
}

function closeDeleteModal() {
  const modal = document.getElementById("delete-modal");
  if (!modal) return;

  clientToDelete = null;
  modal.classList.add("hidden");
  modal.classList.remove("flex");
}

function editClient(id) {
  window.location.href = `/edit_client.html?id=${id}`;
}

async function copyToClipboard(value, successMessage) {
  if (!value) {
    mostrarFeedback("error", "Nao ha informacao para copiar.");
    return;
  }

  try {
    await navigator.clipboard.writeText(value);
    mostrarFeedback("success", successMessage);
  } catch (error) {
    mostrarFeedback("error", "Nao foi possivel copiar automaticamente.");
  }
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

function setState(type, message) {
  const state = document.getElementById("client-state");
  const tableWrapper = document.getElementById("client-table-wrapper");
  if (!state || !tableWrapper) return;

  const styles = {
    loading: "p-6 text-sm text-slate-500",
    empty: "p-6 text-sm text-slate-500",
    error: "p-6 text-sm text-rose-700 bg-rose-50"
  };

  tableWrapper.classList.add("hidden");
  state.className = styles[type] || styles.loading;
  state.textContent = message;
  state.classList.remove("hidden");
}

function mostrarFeedback(tipo, mensagem) {
  const feedback = document.getElementById("feedback");
  if (!feedback) return;

  const estilos = {
    success: "border-emerald-200 bg-emerald-50 text-emerald-800",
    error: "border-rose-200 bg-rose-50 text-rose-800"
  };

  feedback.className = `mb-6 rounded-lg border p-4 text-sm ${estilos[tipo] || estilos.success}`;
  feedback.textContent = mensagem;
  feedback.classList.remove("hidden");
}

function atualizarContadores(total, filtered) {
  const totalCount = document.getElementById("total-count");
  const filteredCount = document.getElementById("filtered-count");

  if (totalCount) totalCount.textContent = total;
  if (filteredCount) filteredCount.textContent = filtered;
}

function formatarDiaVencimento(value) {
  if (!value) return "-";
  return `Dia ${String(value).padStart(2, "0")}`;
}

function formatarMes(value) {
  const meses = [
    "Janeiro",
    "Fevereiro",
    "Marco",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro"
  ];

  const index = Number(value) - 1;
  return meses[index] || "-";
}

function renderStatusBoleto(status) {
  const normalizedStatus = status || "Pendente";
  const styles = {
    Pendente: "bg-amber-50 text-amber-700",
    Baixado: "bg-sky-50 text-sky-700",
    Enviado: "bg-emerald-50 text-emerald-700",
    "Erro/pendencia": "bg-rose-50 text-rose-700",
    "Erro/pendência": "bg-rose-50 text-rose-700"
  };

  return `
    <span class="inline-flex rounded-full px-2 py-1 text-xs font-semibold ${styles[normalizedStatus] || styles.Pendente}">
      ${escapeHtml(normalizedStatus)}
    </span>
  `;
}

function renderStatusEmpresa(status) {
  const statusLabel = normalizarStatusEmpresa(status);
  const styles = {
    Ativa: "bg-emerald-50 text-emerald-700",
    "Em aceitacao": "bg-sky-50 text-sky-700",
    "Em aceitação": "bg-sky-50 text-sky-700",
    Pendencia: "bg-amber-50 text-amber-700",
    Pendência: "bg-amber-50 text-amber-700",
    Cancelada: "bg-rose-50 text-rose-700",
    Cancelado: "bg-rose-50 text-rose-700"
  };

  return `
    <span class="inline-flex rounded-full px-2 py-1 text-xs font-semibold ${styles[statusLabel] || styles.Ativa}">
      ${escapeHtml(statusLabel)}
    </span>
  `;
}

function normalizarStatusEmpresa(status) {
  const rawStatus = String(status || "Ativa").trim();
  const normalized = normalizarTexto(rawStatus);
  const statusMap = {
    ativa: "Ativa",
    "em aceitacao": "Em aceitação",
    pendencia: "Pendência",
    cancelada: "Cancelada",
    cancelado: "Cancelada"
  };

  return statusMap[normalized] || rawStatus || "Ativa";
}

function setText(id, value) {
  const element = document.getElementById(id);
  if (element) element.textContent = value;
}

function normalizarTexto(value) {
  return String(value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function normalizarLinkPortal(value) {
  if (!value) return "";

  try {
    const url = new URL(value);
    return ["http:", "https:"].includes(url.protocol) ? url.href : "";
  } catch (error) {
    return "";
  }
}
