let clientsData = [];
let clientToDelete = null;

document.addEventListener("DOMContentLoaded", () => {
  configurarMenu();
  configurarLogout();
  configurarBusca();
  configurarModalExclusao();
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
          <p class="mt-1 text-xs text-slate-500">${escapeHtml(client.cnpj_cliente || "CNPJ não informado")}</p>
        </div>
      </td>
      <td class="px-5 py-4 text-sm text-slate-700">
        ${escapeHtml(client.responsavel || "-")}
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
        <p class="mt-1 text-xs text-slate-500">${escapeHtml(client.login_portal || "Login não informado")}</p>
        ${client.observacoes_boleto ? `<p class="mt-2 max-w-xs text-xs text-slate-500">${escapeHtml(client.observacoes_boleto)}</p>` : ""}
        <div class="mt-3 flex flex-wrap gap-2">
          ${portalLink ? `
            <a
              href="${escapeAttribute(portalLink)}"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center gap-2 rounded-lg bg-slate-950 px-2 py-1 text-xs font-semibold text-white transition hover:bg-slate-800"
            >
              <i class="fas fa-arrow-up-right-from-square"></i>
              Portal
            </a>
          ` : ""}
          <button
            type="button"
            class="inline-flex items-center gap-2 rounded-lg bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-600 transition hover:bg-slate-200"
            onclick="copyToClipboard('${escapeJs(client.login_portal || "")}', 'Login copiado.')"
          >
            <i class="fas fa-copy"></i>
            Login
          </button>
          <button
            type="button"
            class="inline-flex items-center gap-2 rounded-lg bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-600 transition hover:bg-slate-200"
            onclick="copyToClipboard('${escapeJs(client.senha_portal || "")}', 'Senha copiada.')"
          >
            <i class="fas fa-key"></i>
            Senha
          </button>
        </div>
      </td>
      <td class="px-5 py-4 text-right">
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
      client.operadora,
      client.cnpj_cliente,
      client.plataforma,
      client.email,
      client.link_portal,
      client.status_boleto,
      client.observacoes_boleto
    ].some((value) => normalizarTexto(value).includes(term));
  });

  displayClients(filteredClients);
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

      mostrarFeedback("success", "Cliente excluído com sucesso.");
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
  text.textContent = `Tem certeza que deseja excluir "${client.empresa}"? Esta ação não pode ser desfeita.`;
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

function togglePassword(button) {
  const icon = button.querySelector("i");
  const label = button.querySelector("span");
  const password = button.dataset.password || "";
  const showing = button.dataset.showing === "true";

  if (!icon || !label) return;

  button.dataset.showing = showing ? "false" : "true";
  icon.classList.toggle("fa-eye", showing);
  icon.classList.toggle("fa-eye-slash", !showing);
  label.textContent = showing ? "Mostrar senha" : (password || "Sem senha");
}

async function copyToClipboard(value, successMessage) {
  if (!value) {
    mostrarFeedback("error", "Não há informação para copiar.");
    return;
  }

  try {
    await navigator.clipboard.writeText(value);
    mostrarFeedback("success", successMessage);
  } catch (error) {
    mostrarFeedback("error", "Não foi possível copiar automaticamente.");
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
    "Março",
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
    "Pendente": "bg-amber-50 text-amber-700",
    "Baixado": "bg-sky-50 text-sky-700",
    "Enviado": "bg-emerald-50 text-emerald-700",
    "Erro/pendência": "bg-rose-50 text-rose-700"
  };

  return `
    <span class="inline-flex rounded-full px-2 py-1 text-xs font-semibold ${styles[normalizedStatus] || styles.Pendente}">
      ${escapeHtml(normalizedStatus)}
    </span>
  `;
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

function escapeAttribute(value) {
  return escapeHtml(value).replace(/`/g, "&#096;");
}

function escapeJs(value) {
  return String(value || "")
    .replace(/\\/g, "\\\\")
    .replace(/'/g, "\\'")
    .replace(/\n/g, "\\n")
    .replace(/\r/g, "");
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
