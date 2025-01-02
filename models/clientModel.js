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
    ], (err,result) => {
      if (err) {
        callback(err, null);
      } else {
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
      UPDATE clients SET empresa = ?, operadora = ?, plano = ?, apolice = ?, valor = ?, responsavel = ?, phone = ?, email = ?,
        senha_email = ?, mes_reajuste = ?, login_portal = ?, senha_portal = ? WHERE id = ?
    `;
    db.query(query, [
      client.empresa, client.operadora, client.plano, client.apolice, client.valor, client.responsavel, client.phone, client.email,
      client.senha_email, client.mes_reajuste, client.login_portal, client.senha_portal, id
    ], (err, result) => {
      if (err) {
        callback(err, null);
      } else {
        callback (null, result);
      }
      });
  }

  static deleteById(id, callback) {
    const query = 'DELETE FROM clients WHERE id = ?';
    db.query(query, [id], (err, result) => {
      if (err) {
        callback(err, null);
      } else {
        callback (null, result);
      }
      });
  }
}

module.exports = Client;
