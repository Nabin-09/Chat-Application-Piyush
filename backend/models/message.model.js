import mysql_db from '../config/db.js';

const messageModel = {
  async createMessage({ sender_id, receiver_id, text, image }) {
    const db = await mysql_db();
    try {
      const [result] = await db.execute(
        `INSERT INTO messages (sender_id, receiver_id, text, image)
         VALUES (?, ?, ?, ?)`,
        [sender_id, receiver_id, text, image]
      );
      await db.end();
      return result.insertId;
    } catch (error) {
      await db.end();
      throw error;
    }
  },

  async getMessageHistory(sender_id, receiver_id) {
  const db = await mysql_db();
  try {
    const [rows] = await db.execute(
      `SELECT * FROM messages 
       WHERE (sender_id = ? AND receiver_id = ?) 
       OR (sender_id = ? AND receiver_id = ?) 
       ORDER BY created_at ASC`,
      [sender_id, receiver_id, receiver_id, sender_id]
    );
    await db.end();
    console.log('Fetched messages from DB:', rows);
    return rows.map(row => {
      let parsedReactions = [];
      if (row.reactions) {
        try {
          parsedReactions = JSON.parse(row.reactions);
          if (!Array.isArray(parsedReactions)) {
            console.warn(`Invalid reactions format for message ${row.id}:`, row.reactions);
            parsedReactions = [];
          }
        } catch (error) {
          console.error(`Error parsing reactions for message ${row.id}:`, error.message);
          parsedReactions = [];
        }
      }
      return {
        ...row,
        reactions: parsedReactions,
      };
    });
  } catch (error) {
    await db.end();
    throw error;
  }
},

  async deleteMessage(id) {
    const db = await mysql_db();
    try {
      await db.execute('DELETE FROM messages WHERE id = ?', [id]);
      await db.end();
    } catch (error) {
      await db.end();
      throw error;
    }
  },

  async getMessageById(id) {
  const db = await mysql_db();
  try {
    const [rows] = await db.execute('SELECT * FROM messages WHERE id = ?', [id]);
    await db.end();

    if (!rows[0]) return null;

    const msg = rows[0];

    let parsedReactions = [];
    if (typeof msg.reactions === 'string') {
      try {
        parsedReactions = JSON.parse(msg.reactions);
      } catch (err) {
        console.warn(`⚠️ Failed to parse reactions for message ${id}:`, err.message);
        parsedReactions = [];
      }
    } else if (Array.isArray(msg.reactions)) {
      parsedReactions = msg.reactions;
    }

    return { ...msg, reactions: parsedReactions };
  } catch (error) {
    await db.end();
    throw error;
  }
},

  async updateMessageReactions(id, reactions) {
  const db = await mysql_db();
  try {
    await db.execute(
      'UPDATE messages SET reactions = ? WHERE id = ?',
      [typeof reactions === 'string' ? reactions : JSON.stringify(reactions), id]
    );
    await db.end();
  } catch (error) {
    await db.end();
    throw error;
  }
}

};

export default messageModel;