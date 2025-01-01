const db = require('../config/db');

class Client {
  static create(client, callback) {
    const query = `
      INSERT INTO clients (empresa, operadora, plano, apolice, valor, responsavel, phone, email,
        senha_email, mes_reajuste, login_portal, senha_portal)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    db.query(query, [
      client.empresa, client.operadora, client.plano, client.apolice, client.valor, client.responsavel, client.phone, client.email,
      client.senha_email, client.mes_reajuste, client.login_portal, client.senha_portal
    ], callback);
  }

  static findAll(callback) {
    const query = 'SELECT * FROM clients';
    db.query(query, callback);
  }

  static findById(id, callback) {
    const query = 'SELECT * FROM clients WHERE id = ?';
    db.query(query, [id], callback);
  }

  static updateById(id, client, callback) {
    const query = `
      UPDATE clients SET empresa = ?, operadora = ?, plano = ?, apolice = ?, valor = ?, responsavel = ?, phone = ?, email = ?,
        senha_email = ?, mes_reajuste = ?, login_portal = ?, senha_portal = ? WHERE id = ?
    `;
    db.query(query, [
      client.empresa, client.operadora, client.plano, client.apolice, client.valor, client.responsavel, client.phone, client.email,
      client.senha_email, client.mes_reajuste, client.login_portal, client.senha_portal, id
    ], callback);
  }

  static deleteById(id, callback) {
    const query = 'DELETE FROM clients WHERE id = ?';
    db.query(query, [id], callback);
  }
}

module.exports = Client;
