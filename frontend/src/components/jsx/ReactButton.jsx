import React, { useState, useRef, useEffect } from 'react';
import EmojiPicker from 'emoji-picker-react';
import apiClient from '../helper/apiClient.js';
import socket from '../helper/socket.js';
import styles from '../css/ReactButton.module.css';

const ReactButton = ({ messageId, currentUserId, reactions }) => {
  const [showPicker, setShowPicker] = useState(false);
  const pickerRef = useRef();

  const handleReaction = async (emojiObject) => {
    const emoji = emojiObject.emoji;
    try {
      await apiClient.addReaction(messageId, currentUserId, emoji);
      // socket.emit('add-reaction', { messageId, reaction: { userId: currentUserId, emoji } });
      setShowPicker(false);
    } catch (err) {
      console.error('Error adding reaction:', err);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        setShowPicker(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={styles.reactContainer}>
      <button onClick={() => setShowPicker(prev => !prev)} className={styles.reactBtn}>😊</button>
      {showPicker && (
        <div ref={pickerRef} className={styles.emojiPickerWrapper}>
          <EmojiPicker onEmojiClick={handleReaction} />
        </div>
      )}
      {reactions && reactions.length > 0 && (
        <span className={styles.reactionList}>
          {reactions.map((r, i) => <span key={i}>{r.emoji}</span>)}
        </span>
      )}
    </div>
  );
};

export default ReactButton;
