const db = require('../config/db');

class User {
  static create(user, callback) {
    const query = 'INSERT INTO users (username, password, email) VALUES (?, ?, ?)';
    db.query(query, [user.username, user.password, user.email], callback);
  }

  static findByUsername(username, callback) {
    const query = 'SELECT * FROM users WHERE username = ?';
    db.query(query, [username], callback);
  }

  static findAll(callback) {
    const query = 'SELECT * FROM users';
    db.query(query, callback);
  }
}

module.exports = User;

