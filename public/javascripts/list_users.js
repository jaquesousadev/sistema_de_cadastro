let usersData = [];

document.addEventListener("DOMContentLoaded", () => {
  configurarMenu();
  configurarLogout();
  configurarBusca();
  fetchUsers();
});

async function fetchUsers() {
  setState("loading", "Carregando usuários...");

  try {
    const response = await fetch("/users");
    if (!response.ok) throw new Error("Erro ao buscar usuários.");

    const data = await response.json();
    usersData = Array.isArray(data.users) ? data.users : [];

    atualizarContadores(usersData.length, usersData.length);
    displayUsers(usersData);
  } catch (error) {
    setState("error", `Falha ao carregar a lista de usuários: ${error.message}`);
  }
}

function displayUsers(users) {
  const userList = document.getElementById("user-list");
  const tableWrapper = document.getElementById("user-table-wrapper");
  const state = document.getElementById("user-state");

  if (!userList || !tableWrapper || !state) return;

  userList.innerHTML = "";
  atualizarContadores(usersData.length, users.length);

  if (users.length === 0) {
    tableWrapper.classList.add("hidden");
    setState("empty", "Nenhum usuário encontrado.");
    return;
  }

  state.classList.add("hidden");
  tableWrapper.classList.remove("hidden");

  users.forEach((user) => {
    const row = document.createElement("tr");
    row.className = "align-top transition hover:bg-slate-50";

    row.innerHTML = `
      <td class="px-5 py-4">
        <div class="flex items-center gap-3">
          <span class="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-sky-50 text-sky-700">
            <i class="fas fa-user"></i>
          </span>
          <div>
            <p class="font-semibold text-slate-950">${escapeHtml(user.username || "Usuário sem nome")}</p>
            <p class="mt-1 text-xs text-slate-500">Conta do sistema</p>
          </div>
        </div>
      </td>
      <td class="px-5 py-4 text-sm text-slate-700">
        ${escapeHtml(user.email || "-")}
      </td>
      <td class="px-5 py-4">
        <span class="inline-flex rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
          Ativo
        </span>
      </td>
    `;

    userList.appendChild(row);
  });
}

function configurarBusca() {
  const searchInput = document.getElementById("search-input");
  const clearSearch = document.getElementById("clear-search");

  if (!searchInput || !clearSearch) return;

  searchInput.addEventListener("input", () => {
    const hasValue = searchInput.value.trim() !== "";
    clearSearch.classList.toggle("hidden", !hasValue);
    clearSearch.classList.toggle("inline-flex", hasValue);
    filterUsers();
  });

  clearSearch.addEventListener("click", () => {
    searchInput.value = "";
    clearSearch.classList.add("hidden");
    clearSearch.classList.remove("inline-flex");
    displayUsers(usersData);
    searchInput.focus();
  });
}

function filterUsers() {
  const searchInput = document.getElementById("search-input");
  const term = normalizarTexto(searchInput?.value || "");

  if (!term) {
    displayUsers(usersData);
    return;
  }

  const filteredUsers = usersData.filter((user) => {
    return [
      user.username,
      user.email
    ].some((value) => normalizarTexto(value).includes(term));
  });

  displayUsers(filteredUsers);
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
  const state = document.getElementById("user-state");
  const tableWrapper = document.getElementById("user-table-wrapper");
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

function atualizarContadores(total, filtered) {
  const totalCount = document.getElementById("total-count");
  const filteredCount = document.getElementById("filtered-count");

  if (totalCount) totalCount.textContent = total;
  if (filteredCount) filteredCount.textContent = filtered;
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
