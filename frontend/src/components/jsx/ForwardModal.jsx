import React, { useState, useEffect } from 'react';
import styles from '../css/ForwardModal.module.css'; // optional for styling
import axios from 'axios';

const ForwardModal = ({ isOpen, onClose, onForward, currentUserId, message }) => {
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);

  useEffect(() => {
    if (isOpen) {
      axios.get('http://localhost:8080/userlist/list').then((res) => {
        const filtered = res.data.filter(user => user.id !== currentUserId);
        setUsers(filtered);
      });
    }
  }, [isOpen, currentUserId]);

  const handleForward = () => {
    if (selectedUserId) {
      onForward(selectedUserId);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h3>Select user to forward</h3>
        <select onChange={(e) => setSelectedUserId(Number(e.target.value))}>
          <option value="">-- Choose a user --</option>
          {users.map(user => (
            <option key={user.id} value={user.id}>{user.username}</option>
          ))}
        </select>
        <div className={styles.modalActions}>
          <button onClick={handleForward}>Forward</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default ForwardModal;
