async function fetchUsers() {
  try {
    const response = await fetch('/users');
    if (!response.ok) throw new Error('Erro ao buscar usuários');
    
    const { users } = await response.json(); // Extrai a propriedade users
    window.usersData = users; // Armazena os dados globalmente para facilitar a filtragem
    displayUsers(users);
  } catch (error) {
    alert('Falha ao carregar a lista de usuários: ' + error.message);
  }
}

function displayUsers(users) {
  const userList = document.getElementById('user-list');
  userList.innerHTML = ''; // Limpa a lista existente
  
  users.forEach(user => {
    // Cria o card do usuário
    const userCard = document.createElement('div');
    userCard.className = 'user-card'; // Classe para estilização do card
    
    userCard.innerHTML = `
      <div class="user-info">
        <h5>${user.username}</h5>
        <p>Email: ${user.email}</p>
      </div>
    `;
    
    userList.appendChild(userCard); // Adiciona o card à lista
  });
}

// Carrega os usuários ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
  fetchUsers();
});
