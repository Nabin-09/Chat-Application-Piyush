import mysql_db from './db.js';

(async () => {
  try {
    const db = await mysql_db();

    await db.execute(`
      CREATE TABLE IF NOT EXISTS messages (
        id INT AUTO_INCREMENT PRIMARY KEY,
        sender_id INT NOT NULL,
        receiver_id INT,
        text TEXT,
        image VARCHAR(255),
        status ENUM('sent', 'delivered', 'read') DEFAULT 'sent',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        reactions JSON,
        FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE CASCADE
      );
    `);

    console.log('Message table is ready.');
    await db.end();
  } catch (error) {
    console.error('Error creating messages table:', error);
  }
})();






//     CREATE TABLE IF NOT EXISTS messages (
//     id INT AUTO_INCREMENT PRIMARY KEY,
//     sender_id INT NOT NULL,
//     receiver_id INT,
//     group_id INT,
//     text TEXT,
//     image VARCHAR(255),
//     status ENUM('sent', 'delivered', 'read') DEFAULT 'sent',
//     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//     FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
//     FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE CASCADE,
//     FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE CASCADE
// );