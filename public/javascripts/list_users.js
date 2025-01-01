async function fetchUsers() {
  const response = await fetch('/users');
  const users = await response.json();
  const userList = document.getElementById('user-list');
  userList.innerHTML = ''; // Limpando a lista antes de adicionar novos itens

  // Adicionando um cartão para cada usuário
  users.forEach(user => {
    const userCard = document.createElement('div');
    userCard.classList.add('user-card'); // Classe para estilizar o cartão do usuário
    
    userCard.innerHTML = `
      <div class="user-info">
        <h5>${user.username}</h5>
        <p>Email: ${user.email}</p>
      </div>
    `;
    
    userList.appendChild(userCard);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  fetchUsers();
});

