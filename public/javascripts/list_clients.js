async function fetchClients() {
  try {
    const response = await fetch('/clients');
    if (!response.ok) throw new Error('Erro ao buscar clientes');
    
    const clients = await response.json();
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
    // Cria o item da lista
    const li = document.createElement('li');
    li.className = 'client-item'; // Classe para estilização da lista
    
    li.innerHTML = `
      <span class="client-info">
        <strong>${client.empresa}</strong> - Operadora: ${client.operadora}, Plano: ${client.plano}, Mês Reajuste: ${client.mes_reajuste}, Login Portal Operadora: ${client.login_portal}, Senha Portal Operadora: ${client.senha_portal} 
      </span>
      <span class="client-actions">
        <button class="btn btn-sm btn-light" onclick="editClient(${client.id})">
          <i class="fas fa-pencil-alt"></i>
        </button>
        <button class="btn btn-sm btn-danger" onclick="deleteClient(${client.id})">
          <i class="fas fa-trash-alt"></i>
        </button>
      </span>
    `;
    
    clientList.appendChild(li); // Adiciona o item à lista
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
