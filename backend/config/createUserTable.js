import mysql_db from './db.js';

(async () => {
  try {
    const db = await mysql_db();
    
    await db.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) NOT NULL,
        email VARCHAR(100) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    console.log('Users table is ready.');
    await db.end();
  } catch (error) {
    console.error('Error creating users table:', error);
  }
})();

