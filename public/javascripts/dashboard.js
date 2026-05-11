document.addEventListener("DOMContentLoaded", () => {
  configurarMenu();
  configurarLogout();
  preencherMesAtual();
  iniciarGraficoClientes();
  carregarDashboard();
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

async function carregarDashboard() {
  await carregarDadosDashboard();
  await verificarBoletosVencendo();
  await carregarEmpresasReajuste();
}

async function carregarDadosDashboard() {
  try {
    const response = await fetch("dashboard/dashboard-data");
    if (!response.ok) throw new Error("Erro ao buscar dados do dashboard.");

    const data = await response.json();

    atualizarTexto("totalClientes", data.totalClientes ?? 0);
    atualizarTexto("clientesVencendo", data.clientesVencendo ?? 0);
  } catch (error) {
    console.error("Erro ao carregar os dados do dashboard:", error);
  }
}

async function verificarBoletosVencendo() {
  try {
    const response = await fetch("/clients");
    if (!response.ok) throw new Error("Erro ao buscar clientes.");

    const data = await response.json();
    const clients = data?.clients;
    if (!Array.isArray(clients)) throw new Error("A resposta da API não contém uma lista de clientes.");

    const regraBoletos = obterRegraBoletos();
    const boletosVencendo = clients.filter((cliente) => {
      return regraBoletos.dias.includes(Number(cliente.vencimento));
    });

    atualizarTexto("clientesVencendo", boletosVencendo.length);
    atualizarPainelAlerta(boletosVencendo, regraBoletos);
  } catch (error) {
    console.error("Erro ao verificar boletos vencendo:", error);
  }
}

async function carregarEmpresasReajuste() {
  const cardEmpresas = document.getElementById("empresas-reajuste");
  if (!cardEmpresas) return;

  const mesAtual = new Date().getMonth() + 1;

  try {
    const response = await fetch(`/dashboard/empresas-reajuste/${mesAtual}`);
    if (!response.ok) throw new Error("Erro ao buscar empresas com reajuste.");

    const empresas = await response.json();
    const lista = Array.isArray(empresas) ? empresas : [];

    atualizarTexto("totalReajustes", lista.length);

    if (lista.length === 0) {
      cardEmpresas.innerHTML = `
        <div class="flex items-center gap-3 rounded-lg bg-white p-4 text-slate-500">
          <i class="fas fa-circle-check text-emerald-600"></i>
          Nenhuma empresa com reajuste neste mês.
        </div>
      `;
      return;
    }

    cardEmpresas.innerHTML = `
      <ul class="space-y-2">
        ${lista.map((empresa) => `
          <li class="flex items-start justify-between gap-3 rounded-lg bg-white px-3 py-3 text-slate-700 shadow-sm">
            <span class="min-w-0 flex-1 break-words font-medium leading-snug">${empresa.empresa}</span>
            <span class="shrink-0 rounded-full bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700">Reajuste</span>
          </li>
        `).join("")}
      </ul>
    `;
  } catch (error) {
    console.error("Erro ao buscar empresas:", error);
    atualizarTexto("totalReajustes", 0);
    cardEmpresas.innerHTML = `
      <div class="rounded-lg bg-rose-50 p-4 text-rose-700">
        Erro ao carregar os dados de reajuste.
      </div>
    `;
  }
}

function atualizarPainelAlerta(boletosVencendo, regraBoletos) {
  const alertPanel = document.getElementById("alertPanel");
  const alertText = document.getElementById("alertText");
  const alertCount = document.getElementById("alertCount");
  const alertClientList = document.getElementById("alertClientList");
  if (!alertPanel || !alertText || !alertCount || !alertClientList) return;

  if (!boletosVencendo.length) {
    alertPanel.classList.add("hidden");
    alertClientList.innerHTML = "";
    return;
  }

  alertText.textContent = `Boletos para acompanhamento: ${regraBoletos.rotulo}.`;
  alertCount.textContent = `${boletosVencendo.length} cliente(s)`;
  alertCount.classList.remove("hidden");
  alertClientList.innerHTML = boletosVencendo.map((cliente) => `
    <div class="rounded-lg border border-amber-100 bg-white/70 px-3 py-2 text-sm text-amber-950 shadow-sm">
      <p class="font-semibold leading-snug">${escapeHtml(cliente.empresa || "Empresa sem nome")}</p>
      <p class="mt-1 text-xs text-amber-700">Vencimento: dia ${String(cliente.vencimento).padStart(2, "0")}</p>
    </div>
  `).join("");
  alertPanel.classList.remove("hidden");
}

function obterRegraBoletos(dataBase = new Date()) {
  const dias = [dataBase.getDate()];
  const isSegundaFeira = dataBase.getDay() === 1;

  if (isSegundaFeira) {
    const sabado = new Date(dataBase);
    sabado.setDate(dataBase.getDate() - 2);

    const domingo = new Date(dataBase);
    domingo.setDate(dataBase.getDate() - 1);

    dias.unshift(sabado.getDate(), domingo.getDate());
  }

  return {
    dias: [...new Set(dias)],
    rotulo: isSegundaFeira ? "sábado, domingo e hoje" : "hoje"
  };
}

function preencherMesAtual() {
  const mesAtual = new Intl.DateTimeFormat("pt-BR", { month: "long" }).format(new Date());
  atualizarTexto("mesAtual", mesAtual.charAt(0).toUpperCase() + mesAtual.slice(1));
}

function iniciarGraficoClientes() {
  const canvas = document.getElementById("graficoClientes");
  if (!canvas || typeof Chart === "undefined") return;

  new Chart(canvas.getContext("2d"), {
    type: "bar",
    data: {
      labels: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun"],
      datasets: [{
        label: "Clientes cadastrados",
        data: [5, 10, 8, 12, 20, 15],
        backgroundColor: "#0f172a",
        borderRadius: 6,
        maxBarThickness: 44
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: "#0f172a",
          padding: 12,
          titleColor: "#ffffff",
          bodyColor: "#e2e8f0"
        }
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { color: "#64748b" }
        },
        y: {
          beginAtZero: true,
          grid: { color: "#e2e8f0" },
          ticks: { color: "#64748b", precision: 0 }
        }
      }
    }
  });
}

function atualizarTexto(id, valor) {
  const elemento = document.getElementById(id);
  if (elemento) elemento.textContent = valor;
}

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
