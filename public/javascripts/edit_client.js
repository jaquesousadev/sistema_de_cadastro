document.addEventListener('DOMContentLoaded', async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const clientId = urlParams.get('id');
  
  try {
    const response = await fetch(`/clients/${clientId}`);
    if (!response.ok) throw new Error('Cliente não encontrado');
    
    const client = await response.json();
    
    // Verifique se o cliente foi encontrado e os dados são válidos
    if (!client) {
      throw new Error('Cliente não encontrado');
    }
  
    document.getElementById('client-id').value = client.id;
    document.getElementById('empresa').value = client.empresa || '';
    document.getElementById('operadora').value = client.operadora || '';
    document.getElementById('plano').value = client.plano || '';
    document.getElementById('apolice').value = client.apolice || '';
    document.getElementById('valor').value = client.valor || '';
    document.getElementById('responsavel').value = client.responsavel || '';
    document.getElementById('phone').value = client.phone || '';
    document.getElementById('email').value = client.email || '';
    document.getElementById('senha_email').value = client.senha_email || '';
    document.getElementById('mes_reajuste').value = client.mes_reajuste || '';
    document.getElementById('login_portal').value = client.login_portal || '';
    document.getElementById('senha_portal').value = client.senha_portal || '';
  } catch (error) {
    alert('Erro ao carregar dados do cliente: ' + error.message);
  }
});

  
  document.getElementById('edit-client-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    console.log('Formulário submetido'); // Verificação
  
    const id = document.getElementById('client-id').value;
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

    console.log('Dados do cliente:', {
      empresa, operadora, plano, apolice, valor, responsavel, phone, email,
      senha_email, mes_reajuste, login_portal, senha_portal
    }); // Verificação
  
    const response = await fetch(`/clients/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        empresa, operadora, plano, apolice, valor, responsavel, phone, email,
        senha_email, mes_reajuste, login_portal, senha_portal
      })
    });
  
    if (response.ok) {
      alert('Cliente atualizado com sucesso!');
      window.location.href = 'list_clients.html';
    } else {
      const result = await response.json();
      alert('Falha ao atualizar cliente: ' + (result.message || 'Erro desconhecido'));
    }
  });

  


  