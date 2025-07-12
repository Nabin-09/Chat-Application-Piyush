import React, { useState } from 'react';
import apiClient from '../helper/apiClient';
import socket from '../helper/socket';
import ForwardModal from './ForwardModal';
import styles from '../css/ActionButton.module.css';

const ActionButton = ({ messageId, senderId, currentUserId, message }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showForwardModal, setShowForwardModal] = useState(false);

  const handleDelete = async () => {
    if (senderId !== currentUserId) return;
    try {
      await apiClient.deleteMessage(messageId, currentUserId);
      socket.emit('delete-message', { messageId, sender_id: currentUserId });
      setIsOpen(false);
    } catch (err) {
      console.error('Error deleting message:', err);
    }
  };

  const handleForward = (receiverId) => {
    apiClient.forwardMessage(currentUserId, receiverId, message.id)
      .catch((err) => {
        console.error('Error forwarding message:', err);
      });
  };

  return (
    <div className={styles.actionWrapper}>
      <button onClick={() => setIsOpen(!isOpen)} className={styles.dropdownToggle}>🔽</button>

      {isOpen && (
        <div className={styles.dropdownMenu}>
          <button onClick={handleDelete} disabled={senderId !== currentUserId} className={styles.dropdownItem}>
            Delete
          </button>
          <button onClick={() => setShowForwardModal(true)} className={styles.dropdownItem}>
            Forward
          </button>
        </div>
      )}

      <ForwardModal
        isOpen={showForwardModal}
        onClose={() => setShowForwardModal(false)}
        onForward={handleForward}
        currentUserId={currentUserId}
        message={message}
      />
    </div>
  );
};

export default ActionButton;

