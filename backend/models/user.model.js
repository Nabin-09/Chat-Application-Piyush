import mysql_db from '../config/db.js';

const userModel = {
  async createUser({ username, email, password }) {
    const db = await mysql_db();
    try {
      const [result] = await db.execute(
        'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
        [username, email, password]
      );
      await db.end();
      return result;
    } catch (error) {
      await db.end();
      throw error;
    }
  },

  async findByEmail(email) {
    const db = await mysql_db();
    try {
      const [rows] = await db.execute(
        'SELECT * FROM users WHERE email = ?',
        [email]
      );
      await db.end();
      return rows[0];
    } catch (error) {
      await db.end();
      throw error;
    }
  },

  async findByUsername(username) {
    const db = await mysql_db();
    try {
      const [rows] = await db.execute(
        'SELECT * FROM users WHERE username = ?',
        [username]
      );
      await db.end();
      return rows[0];
    } catch (error) {
      await db.end();
      throw error;
    }
  }
};

export default userModel;


