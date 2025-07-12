import express from 'express';
import mysql_db from '../config/db.js';

const router = express.Router();

// CREATE GROUP
// router.post('/create', async (req, res) => {
//   const { name, members } = req.body;
//   console.log('Create Group:', { name, members });

//   if (!name || !Array.isArray(members) || members.length === 0) {
//   return res.status(400).json({ message: 'Group name and members are required' });
// }


//   try {
//     const db = await mysql_db();

//     const [result] = await db.execute('INSERT INTO `groups` (name) VALUES (?)', [name]);
//     const groupId = result.insertId;

//     const insertValues = members
//       .filter((userId) => typeof userId === 'number' && !isNaN(userId))
//       .map((userId) => [groupId, userId]);

//     if (insertValues.length === 0) {
//       return res.status(400).json({ message: 'No valid members selected' });
//     }

//     await db.query('INSERT INTO group_members (group_id, user_id) VALUES ?', [insertValues]);

//     await db.end();

//     res.status(201).json({ message: 'Group created successfully', groupId });
//   } catch (err) {
//     console.error('Group creation error:', err);
//     res.status(500).json({ message: 'Failed to create group' });
//   }
// });

router.post('/create', async (req, res) => {
  const { name, members, created_by } = req.body;

  if (!name || !Array.isArray(members) || members.length === 0 || !created_by) {
    return res.status(400).json({ message: 'Missing name, members, or created_by' });
  }

  try {
    const db = await mysql_db();

    const [groupResult] = await db.execute(
      'INSERT INTO `groups` (name, created_by) VALUES (?, ?)',
      [name, created_by]
    );
    const groupId = groupResult.insertId;

    const insertValues = members.map((userId) => [groupId, userId]);
    await db.query('INSERT INTO group_members (group_id, user_id) VALUES ?', [insertValues]);

    await db.end();
    res.status(201).json({ message: 'Group created successfully', groupId });
  } catch (err) {
    console.error('Group creation error:', err);
    res.status(500).json({ message: 'Group creation failed' });
  }
});



// GET GROUPS FOR A USER
router.get('/user/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const db = await mysql_db();
    const [groups] = await db.execute(
      `
      SELECT g.id, g.name
      FROM \`groups\` g
      JOIN group_members gm ON g.id = gm.group_id
      WHERE gm.user_id = ?
      `,
      [userId]
    );
    await db.end();
    res.json(groups);
  } catch (err) {
    console.error('Error fetching user groups:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET MESSAGES FOR A GROUP
router.get('/:groupId/messages', async (req, res) => {
  const { groupId } = req.params;
  try {
    const db = await mysql_db();
    const [messages] = await db.execute(
      `
      SELECT gm.id, gm.group_id, gm.sender_id, u.username, gm.text, gm.created_at
      FROM group_messages gm
      JOIN users u ON gm.sender_id = u.id
      WHERE gm.group_id = ?
      ORDER BY gm.created_at ASC
      `,
      [groupId]
    );
    await db.end();
    res.json(messages);
  } catch (err) {
    console.error('Error fetching group messages:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// OPTIONAL: SEND GROUP MESSAGE via REST (mainly for testing, socket handles real-time)
router.post('/message/send', async (req, res) => {
  const { group_id, sender_id, text } = req.body;
  try {
    const db = await mysql_db();
    await db.execute(
      `INSERT INTO group_messages (group_id, sender_id, text) VALUES (?, ?, ?)`,
      [group_id, sender_id, text]
    );
    await db.end();
    res.status(201).json({ message: 'Group message sent' });
  } catch (err) {
    console.error('Error sending group message:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;

