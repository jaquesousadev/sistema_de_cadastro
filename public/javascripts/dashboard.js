document.addEventListener('DOMContentLoaded', async () => {
    await carregarDadosDashboard(); // Busca os dados assim que a página carregar
    await verificarBoletosVencendo(); // Verifica boletos vencendo ao carregar a página
});

//  Busca dados reais do banco de dados e exibe no dashboard
async function carregarDadosDashboard() {
    try {
        const response = await fetch('dashboard/dashboard-data');
        if (!response.ok) throw new Error("Erro ao buscar dados do dashboard.");
        
        const data = await response.json();
        console.log("📊 Dados recebidos:", data);

        const totalClientesElem = document.getElementById("totalClientes");
        const clientesVencendoElem = document.getElementById("clientesVencendo");

        if (!totalClientesElem || !clientesVencendoElem) {
            console.error("❌ Elementos HTML não encontrados!");
            return;
        }

        totalClientesElem.textContent = data.totalClientes;
        clientesVencendoElem.textContent = data.clientesVencendo;

        console.log("✅ Dashboard atualizado!");
    } catch (error) {
        console.error("❌ Erro ao carregar os dados do dashboard:", error);
    }
}


//  Verifica clientes com boletos vencendo hoje
async function verificarBoletosVencendo() {
    try {
        const response = await fetch('/clients'); // Chama a API que retorna os clientes
        if (!response.ok) throw new Error("Erro ao buscar clientes.");

        const data = await response.json();
        console.log("Clientes recebidos:", data);

        const clients = data?.clients;
        if (!Array.isArray(clients)) throw new Error("A resposta da API não contém uma lista de clientes.");

        const hoje = new Date();
        const diaHoje = hoje.getDate().toString().padStart(2, '0'); // Formata para "01", "02", etc.

        let boletosVencendo = [];

        clients.forEach(cliente => {
            const vencimento = cliente.vencimento.toString().padStart(2, '0'); // Formata corretamente

            if (vencimento === diaHoje) {
                boletosVencendo.push(cliente.empresa);
            }
        });

        // Atualiza o número de clientes com boletos vencendo no dashboard
        const clientesVencendoElem = document.getElementById("clientesVencendo");
        if (clientesVencendoElem) {
            clientesVencendoElem.textContent = boletosVencendo.length; // Define a quantidade correta
        } else {
            console.error("❌ Elemento clientesVencendo não encontrado!");
        }

        // Exibe alerta apenas se houver boletos vencendo
        if (boletosVencendo.length > 0) {
            alert("Boletos vencendo hoje:\n" + boletosVencendo.join("\n"));
        } else {
            console.log("Nenhum boleto vence hoje.");
        }
    } catch (error) {
        console.error("Erro ao verificar boletos vencendo:", error);
    }
}

document.addEventListener("DOMContentLoaded", function () {
    let menuToggle = document.querySelector(".menu-toggle");

    // Se o botão de menu não existir, cria um novo
    if (!menuToggle) {
        menuToggle = document.createElement("button");
        menuToggle.className = "menu-toggle";
        menuToggle.textContent = "☰ Menu";
        document.body.appendChild(menuToggle);
    }

    const sidebar = document.querySelector(".sidebar");
    const mainContent = document.querySelector(".main-content");

    menuToggle.addEventListener("click", function () {
        sidebar.classList.toggle("open");

        // Ajusta a margem do conteúdo ao abrir/fechar o menu
        if (sidebar.classList.contains("open")) {
            mainContent.style.marginLeft = "250px"; // Mesmo tamanho da sidebar
        } else {
            mainContent.style.marginLeft = "0";
        }
    });

    // Garante que o menu feche automaticamente ao redimensionar a tela
    window.addEventListener("resize", function () {
        if (window.innerWidth > 768) {
            sidebar.classList.remove("open");
            mainContent.style.marginLeft = "270px"; // Valor normal para telas grandes
        } else {
            mainContent.style.marginLeft = "0";
        }
    });
});

document.addEventListener("DOMContentLoaded", async function () {
    carregarEmpresasReajuste();
});

async function carregarEmpresasReajuste() {
    const cardEmpresas = document.getElementById("empresas-reajuste");
    const mesAtual = new Date().getMonth() + 1; // Obtém o mês atual (1-12)

    try {
        const response = await fetch(`/dashboard/empresas-reajuste/${mesAtual}`);
        const empresas = await response.json();

        if (empresas.length > 0) {
            let listaEmpresas = "<ul class='list-group'>";
            empresas.forEach(empresa => {
                listaEmpresas += `<li class='list-group-item'>${empresa.empresa}</li>`;
            });
            listaEmpresas += "</ul>";

            cardEmpresas.innerHTML = listaEmpresas;
        } else {
            cardEmpresas.innerHTML = "<p class='text-muted'>Nenhuma empresa com reajuste neste mês.</p>";
        }
    } catch (error) {
        console.error("Erro ao buscar empresas:", error);
        cardEmpresas.innerHTML = "<p class='text-danger'>Erro ao carregar os dados.</p>";
    }
}


//  Função de logout
function logout() {
    alert("Você saiu do sistema!");
    window.location.href = "index.html";
}
