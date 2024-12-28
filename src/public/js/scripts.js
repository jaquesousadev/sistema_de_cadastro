document.getElementById('login-form')?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
  
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
  });
  
  document.getElementById('register-form')?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const email = document.getElementById('email').value;
  
    const response = await fetch('/users/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password, email })
    });
  
    const result = await response.json();
  
    if (result.success) {
      alert('Usuário registrado com sucesso!');
      window.location.href = '/index.html';
    } else {
      alert('Falha no registro: ' + (result.message || 'Erro desconhecido'));
    }
  });
  