import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import UserList from './UserList';
import ChatPage from './ChatPage';
import GroupChatPage from './GroupChatPage';
import styles from '../css/ChatLayout.module.css';

function ChatLayout() {
  const { type, id } = useParams();
  const navigate = useNavigate();

  // ✅ Correctly define and use the handler
  const onSelectChat = (type, id) => {
    navigate(`/chat/${type}/${id}`);
  };

  return (
    <div className={styles.chatLayoutContainer}>
      <div className={styles.sidebar}>
        <UserList onSelectChat={onSelectChat} />
      </div>
      <div className={styles.chatArea}>
        {type === 'user' ? (
          <ChatPage />
        ) : type === 'group' ? (
          <GroupChatPage />
        ) : (
          <div className={styles.placeholder}>Select a user or group to chat</div>
        )}
      </div>
    </div>
  );
}

export default ChatLayout;
