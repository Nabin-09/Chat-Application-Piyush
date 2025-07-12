import React, { useState, useEffect } from 'react';
import apiClient from '../helper/apiClient';
import styles from '../css/Profile.module.css'; // optional styling

function Profile() {
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsed = JSON.parse(userData);
      setCurrentUser(parsed);
      if (parsed.image) {
        setPreview(`http://localhost:8080${parsed.image}`);
      }
    }
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleUpload = async () => {
  if (!selectedFile || !currentUser) return;
  const formData = new FormData();
  formData.append('image', selectedFile);

  try {
    const res = await apiClient.uploadProfileImage(currentUser.id, formData);
    const updatedUser = {
      ...currentUser,
      image: res.path // update image path from response
    };

    setCurrentUser(updatedUser); // update state
    localStorage.setItem('user', JSON.stringify(updatedUser)); // update localStorage
    alert('Profile image updated!');
  } catch (err) {
    console.error('Image upload failed:', err);
    alert('Failed to upload image');
  }
};


  const handleChangePassword = async () => {
    if (!newPassword || newPassword !== confirmPassword) {
      setStatus('Passwords do not match.');
      return;
    }

    try {
      await apiClient.updatePassword(currentUser.id, newPassword);
      setStatus('Password updated successfully.');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      console.error('Password update failed:', err);
      setStatus('Failed to update password.');
    }
  };

  if (!currentUser) return <div>Loading profile...</div>;

  return (
    <div className={styles.profileContainer}>
      <h2>My Profile</h2>

      <div className={styles.section}>
        <img
          src={preview || (currentUser?.image ? `http://localhost:8080${currentUser.image}` : 'https://via.placeholder.com/100')}
          alt="Profile"
          className={styles.profileImg}
        />
        <input type="file" accept="image/*" onChange={handleFileChange} />
        <button onClick={handleUpload}>Upload Image</button>
      </div>

      <div className={styles.section}>
        <p><strong>Username:</strong> {currentUser.username}</p>
        <p><strong>Email:</strong> {currentUser.email || 'Not Available'}</p>
        <p><strong>User ID:</strong> {currentUser.id}</p>
      </div>

      <div className={styles.section}>
        <h4>Change Password</h4>
        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="Confirm New Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <button onClick={handleChangePassword}>Update Password</button>
        {status && <p className={styles.status}>{status}</p>}
      </div>
    </div>
  );
}

export default Profile;


