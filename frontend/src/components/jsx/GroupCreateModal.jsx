import React, { useState, useEffect } from 'react';
import apiClient from '../helper/apiClient';
import styles from '../css/GroupCreateModal.module.css';

function GroupCreateModal({ onClose }) {
  const [groupName, setGroupName] = useState('');
  const [allUsers, setAllUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await apiClient.getUserList(); // your existing function
        setAllUsers(res);
      } catch (err) {
        console.error('Failed to load users:', err);
      }
    };

    fetchUsers();
  }, []);

  const handleToggleUser = (userId) => {
    setSelectedUsers((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };

  const handleCreateGroup = async () => {
    if (!groupName.trim()) return alert('Group name is required');
    if (selectedUsers.length === 0) return alert('Select at least one member');

    const payload = {
      name: groupName,
      members: selectedUsers.map((id) => parseInt(id)),
      created_by: JSON.parse(localStorage.getItem('user')).id,
    };

    console.log('Creating group with:', payload);

    try {
      await apiClient.createGroup(payload);
      alert('Group created successfully!');
      onClose();
    } catch (err) {
      console.error('Group creation failed:', err);
      alert('Group creation failed.');
    }
  };

  return (
    <div className={styles.modalBackdrop}>
      <div className={styles.modal}>
        <h2>Create Group</h2>

        <input
          type="text"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          placeholder="Group name"
          className={styles.input}
        />

        <div className={styles.userList}>
          {allUsers.map((user) => (
            <label key={user.id} className={styles.userItem}>
              <input
                type="checkbox"
                checked={selectedUsers.includes(user.id)}
                onChange={() => handleToggleUser(user.id)}
              />
              {user.username}
            </label>
          ))}
        </div>

        <div className={styles.buttonGroup}>
          <button onClick={handleCreateGroup} className={styles.createBtn}>
            Create
          </button>
          <button onClick={onClose} className={styles.cancelBtn}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default GroupCreateModal;
