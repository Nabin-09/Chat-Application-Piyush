import mysql_db from './db.js';

(async () => {
  try {
    const db = await mysql_db();
    
    await db.execute(`
      CREATE TABLE IF NOT EXISTS usersList (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    console.log('Users List table is ready.');
    await db.end();
  } catch (err) {
    console.error('Error creating users list table:', err);
  }
})();

// import mysql_db from './db.js';

// (async () => {
//   try {
//     const db = await mysql_db();
//     await db.execute(`
//       CREATE TABLE IF NOT EXISTS usersList (
//         id INT AUTO_INCREMENT PRIMARY KEY,
//         username VARCHAR(255) NOT NULL,
//         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
//       );
//     `);
//     console.log('Users List table is ready.');

    // Insert test users if table is empty
    // const [rows] = await db.execute('SELECT COUNT(*) as count FROM users');
    // if (rows[0].count === 0) {
    //   await db.execute(`
    //     INSERT INTO users (username) VALUES
    //     ('User4'),
    //     ('User5'),
    //     ('TestUser1'),
    //     ('TestUser2');
    //   `);
    //   console.log('Inserted test users.');
    // }
//   } catch (err) {
//     console.error('Error creating users table:', err);
//   }
// })();