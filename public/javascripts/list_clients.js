async function fetchClients() {
  try {
    const response = await fetch('/clients');
    if (!response.ok) throw new Error('Erro ao buscar clientes');
    
    const { clients } = await response.json(); // Extrai a propriedade clients
    window.clientsData = clients; // Armazena os dados globalmente para facilitar a filtragem
    displayClients(clients);
  } catch (error) {
    alert('Falha ao carregar a lista de clientes: ' + error.message);
  }
}

function displayClients(clients) {
  const clientList = document.getElementById('client-list');
  clientList.innerHTML = ''; // Limpa a lista existente

  clients.forEach(client => {
    const card = document.createElement('div');
    card.className = 'bg-white dark:bg-gray-800 p-4 rounded-lg shadow hover:shadow-lg transition';

    card.innerHTML = `
      <div class="mb-2 font-semibold text-lg">${client.empresa}</div>
      <p class="text-sm text-gray-600 dark:text-gray-300"><strong>Responsável:</strong> ${client.responsavel || '—'}</p>
      <p class="text-sm text-gray-600 dark:text-gray-300"><strong>Operadora:</strong> ${client.operadora}</p>
      <p class="text-sm text-gray-600 dark:text-gray-300"><strong>Mês Reajuste:</strong> ${client.mes_reajuste}</p>
      <p class="text-sm text-gray-600 dark:text-gray-300"><strong>Login Portal:</strong> ${client.login_portal}</p>
      <p class="text-sm text-gray-600 dark:text-gray-300"><strong>Senha Portal:</strong> ${client.senha_portal}</p>
      <p class="text-sm text-gray-600 dark:text-gray-300"><strong>Plataforma:</strong> ${client.plataforma}</p>
      <div class="mt-4 flex justify-between">
        <button class="text-blue-600 hover:text-blue-800 text-sm" onclick="editClient(${client.id})">
          <i class="fas fa-edit"></i> Editar
        </button>
        <button class="text-red-600 hover:text-red-800 text-sm" onclick="deleteClient(${client.id})">
          <i class="fas fa-trash-alt"></i> Excluir
        </button>
      </div>
    `;

    clientList.appendChild(card);
  });
}

function filterClients() {
  const searchInput = document.getElementById('search-input').value.toLowerCase();
  const filteredClients = window.clientsData.filter(client =>
    client.empresa.toLowerCase().includes(searchInput)
  );
  displayClients(filteredClients);
}

async function deleteClient(id) {
  if (confirm('Tem certeza que deseja excluir este cliente?')) {
    try {
      const response = await fetch(`/clients/${id}`, { method: 'DELETE' });
      if (response.ok) {
        alert('Cliente excluído com sucesso!');
        fetchClients(); // Atualiza a lista
      } else {
        const result = await response.json();
        throw new Error(result.message || 'Erro desconhecido');
      }
    } catch (error) {
      alert('Falha ao excluir cliente: ' + error.message);
    }
  }
}

function editClient(id) {
  // Redireciona para a página de edição com o ID do cliente
  window.location.href = `/edit_client.html?id=${id}`;
}

// Carrega os clientes ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
  fetchClients();

  // Adiciona o evento de clique ao botão de pesquisa
  document.getElementById('search-button').addEventListener('click', filterClients);
});
