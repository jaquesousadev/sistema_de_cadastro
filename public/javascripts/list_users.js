// Busca os usuários do backend
async function fetchUsers() {
  try {
    const response = await fetch('/users');
    if (!response.ok) throw new Error('Erro ao buscar usuários');

    const { users } = await response.json();
    window.usersData = users; // Armazena para filtros futuros
    displayUsers(users);
  } catch (error) {
    alert('Falha ao carregar a lista de usuários: ' + error.message);
  }
}

// Exibe os usuários em cards modernos
function displayUsers(users) {
  const userList = document.getElementById('user-list');
  userList.innerHTML = '';

  users.forEach(user => {
    const card = document.createElement('div');
    card.className = 'bg-white dark:bg-gray-800 p-4 rounded-lg shadow hover:shadow-lg transition';

    card.innerHTML = `
      <div class="mb-2 font-semibold text-lg">${user.nome || 'Usuário sem nome'}</div>
      <p class="text-sm text-gray-600 dark:text-gray-300"><strong>Email:</strong> ${user.email || '—'}</p>
      <p class="text-sm text-gray-600 dark:text-gray-300"><strong>Função:</strong> ${user.funcao || '—'}</p>
      <div class="mt-4 flex justify-between">
        <button class="text-blue-600 hover:text-blue-800 text-sm" onclick="editUser(${user.id})">
          <i class="fas fa-edit"></i> Editar
        </button>
        <button class="text-red-600 hover:text-red-800 text-sm" onclick="deleteUser(${user.id})">
          <i class="fas fa-trash-alt"></i> Excluir
        </button>
      </div>
    `;

    userList.appendChild(card);
  });
}

// Redireciona para a página de edição
function editUser(id) {
  window.location.href = `/edit_user.html?id=${id}`;
}

// Exclui o usuário com confirmação
async function deleteUser(id) {
  if (confirm('Tem certeza que deseja excluir este usuário?')) {
    try {
      const response = await fetch(`/users/${id}`, { method: 'DELETE' });
      if (response.ok) {
        alert('Usuário excluído com sucesso!');
        fetchUsers(); // Atualiza a lista
      } else {
        const result = await response.json();
        throw new Error(result.message || 'Erro desconhecido');
      }
    } catch (error) {
      alert('Falha ao excluir usuário: ' + error.message);
    }
  }
}

// Carrega os usuários ao abrir a página
document.addEventListener('DOMContentLoaded', () => {
  fetchUsers();
});