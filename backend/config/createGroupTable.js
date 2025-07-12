import mysql_db from './db.js';

(async () => {
  try {
    const db = await mysql_db();

    // Create groups table (escaped using backticks)
    await db.execute(`
      CREATE TABLE IF NOT EXISTS \`groups\` (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        created_by INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (created_by) REFERENCES users(id)
      );
    `);
    console.log('groups table is ready.');

    // Create group_members table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS group_members (
        id INT AUTO_INCREMENT PRIMARY KEY,
        group_id INT NOT NULL,
        user_id INT NOT NULL,
        joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (group_id) REFERENCES \`groups\`(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );
    `);
    console.log('group_members table is ready.');

    // Create group_messages table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS group_messages (
        id INT AUTO_INCREMENT PRIMARY KEY,
        group_id INT NOT NULL,
        sender_id INT NOT NULL,
        text TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (group_id) REFERENCES \`groups\`(id) ON DELETE CASCADE,
        FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE
      );
    `);
    console.log('group_messages table is ready.');

    await db.end();
  } catch (err) {
    console.error('Error creating group-related tables:', err);
  }
})();



