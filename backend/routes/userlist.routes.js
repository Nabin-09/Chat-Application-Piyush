import express, { Router } from 'express';
import mysql_db from '../config/db.js';

const router = Router();

router.get('/list', async (req, res) => {
  try {
    const db = await mysql_db();
    const [users] = await db.execute('SELECT id, username FROM users');
    await db.end();
    
    if (!users.length) {
      console.log('No users found in the database');
      return res.status(200).json([]);
    }
    
    console.log('Fetched users:', users);
    res.status(200).json(users);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ message: 'Server error while fetching users' });
  }
});

export default router;