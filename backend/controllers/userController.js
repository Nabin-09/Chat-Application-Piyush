import mysql_db from '../config/db.js'; // ✅ ensure this is correct

export const updateUserImage = async (req, res) => {
  try {
    const userId = req.params.id;

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const imagePath = `/uploads/${req.file.filename}`;

    // ✅ fix: use db.execute, not db.query
    const db = await mysql_db();
    await db.execute('UPDATE users SET image = ? WHERE id = ?', [imagePath, userId]);
    await db.end();

    res.status(200).json({ message: 'Image uploaded successfully', path: imagePath });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ message: 'Server error while uploading image' });
  }
};


