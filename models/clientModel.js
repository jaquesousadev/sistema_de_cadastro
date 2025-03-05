const db = require('../config/db');

class Client {
  static create(client, callback) {
    const query = `
      INSERT INTO clients (empresa, operadora, plano, apolice, valor, responsavel, vencimento, vidas, phone, email,
        senha_email, mes_reajuste, login_portal, senha_portal, cnpj_cliente, plataforma)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    console.log("Query para criar cliente:", query); // Log da query
    db.query(query, [
      client.empresa, client.operadora, client.plano, client.apolice, client.valor, client.responsavel, client.vencimento, client.vidas,
      client.phone, client.email, client.senha_email, client.mes_reajuste, client.login_portal, client.senha_portal, client.cnpj_cliente, 
      client.plataforma
    ], (err,result) => {
      if (err) {
        console.error("Erro ao criar cliente:", err); // Log de erro
        callback(err, null);
      } else {
        console.log("Cliente criado com sucesso:", result); // Log de sucesso
        callback (null, result);
      }
    });
    
  }

  static findAll(callback) {
    const query = 'SELECT * FROM clients';
    db.query(query, (err, result) => {
      if (err) {
        callback(err, null);
      } else {
        callback (null, result);
      }
      });
  }

  static findById(id, callback) {
    const query = 'SELECT * FROM clients WHERE id = ?';
    db.query(query, [id], (err, result) => {
      if (err) {
        callback(err, null);
      } else {
        callback (null, result[0]);
      }
      });
  }

  static updateById(id, client, callback) {
    const query = `
      UPDATE clients SET empresa = ?, operadora = ?, plano = ?, apolice = ?, valor = ?, responsavel = ?, vencimento = ?, vidas = ?,
       phone = ?, email = ?, senha_email = ?, mes_reajuste = ?, login_portal = ?, senha_portal = ?, cnpj_cliente= ?, plataforma = ?
       WHERE id = ?
    `;
    console.log("Query para atualizar cliente:", query); // Log da query
    db.query(query, [
      client.empresa, client.operadora, client.plano, client.apolice, client.valor, client.responsavel, client.vencimento, client.vidas,
      client.phone, client.email, client.senha_email, client.mes_reajuste, client.login_portal, client.senha_portal, client.cnpj_cliente, 
      client.plataforma, id
    ], (err, result) => {
      if (err) {
        console.error("Erro ao atualizar cliente", err); // Log de erro
        callback(err, null);
      } else {
        console.log("Cliente atualizado com sucesso:", result); // Log de sucesso
        callback (null, result);
      }
      });
  }

  static deleteById(id, callback) {
    const query = 'DELETE FROM clients WHERE id = ?';
    db.query(query, [id], (err, result) => {
      if (err) {
        console.error("Erro ao excluir cliente", err); // Log de erro
        callback(err, null);
      } else {
        callback (null, result);
      }
      });
  }
}

module.exports = Client;
