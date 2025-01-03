document.getElementById('register-client-form')?.addEventListener('submit', async (event) => {
  event.preventDefault();
  const empresa = document.getElementById('empresa').value;
  const operadora = document.getElementById('operadora').value;
  const plano = document.getElementById('plano').value;
  const apolice = document.getElementById('apolice').value;
  const valor = document.getElementById('valor').value;
  const responsavel = document.getElementById('responsavel').value;
  const phone = document.getElementById('phone').value;
  const email = document.getElementById('email').value;
  const senha_email = document.getElementById('senha_email').value;
  const mes_reajuste = document.getElementById('mes_reajuste').value;
  const login_portal = document.getElementById('login_portal').value;
  const senha_portal = document.getElementById('senha_portal').value;
  const plataforma = document.getElementById('plataforma').value;

  const response = await fetch('/clients/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      empresa, operadora, plano, apolice, valor, responsavel, phone, email,
      senha_email, mes_reajuste, login_portal, senha_portal, plataforma
    })
  });

  const result = await response.json();

  if (response.ok) {
    alert('Cliente registrado com sucesso!');
    document.getElementById('register-client-form').reset();
  } else {
    alert('Falha no registro: ' + (result.message || 'Erro desconhecido'));
  }
});
