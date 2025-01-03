async function fetchUsers() {
  try {
    const response = await fetch('/users');
    const data = await response.json();

    // Verifica se a estrutura da resposta está correta
    if (data.success && Array.isArray(data.users)) {
      const users = data.users;
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
    } else {
      console.error('Formato de resposta inesperado:', data);
    }
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  fetchUsers();
});
