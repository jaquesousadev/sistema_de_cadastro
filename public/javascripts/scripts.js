document.addEventListener('DOMContentLoaded', () => {
    // Listener para o formulário de login
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
      loginForm.addEventListener('submit', async (event) => {
        event.preventDefault(); // Impede o comportamento padrão do formulário
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
  
        try {
          const response = await fetch('/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
          });
  
          const result = await response.json();
  
          if (result.success) {
            window.location.href = '/dashboard.html';
          } else {
            alert('Login falhou: ' + result.message);
          }
        } catch (error) {
          console.error('Erro:', error);
          alert('Ocorreu um erro ao tentar logar.');
        }
      });
    }
  
    // Listener para o formulário de registro
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
      registerForm.addEventListener('submit', async (event) => {
        event.preventDefault(); // Impede o comportamento padrão do formulário
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const email = document.getElementById('email').value;
  
        try {
          const response = await fetch('/users/register', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password, email })
          });

          // Verifica se o retorno é JSON
          if (!response.ok) {
            const errorText = await response.text();
            console.error('Erro do servidor:', errorText);
            alert('Erro ao registrar usuário: ' + errorText);
            return;
          }
  
          const result = await response.json();
  
          if (result.success) {
            alert('Usuário registrado com sucesso!');
            window.location.href = '/index.html';
          } else {
            alert('Falha no registro: ' + result.message);
          }
        } catch (error) {
          console.error('Erro:', error);
          alert('Ocorreu um erro ao tentar registrar.');
        }
      });
    }
  });
  