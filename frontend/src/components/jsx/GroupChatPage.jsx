import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styles from '../css/ChatPage.module.css';
import socket from '../helper/socket';
import apiClient from '../helper/apiClient';
import ActionButton from './ActionButton';
import ReactButton from './ReactButton';

function GroupChatPage() {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [groupInfo, setGroupInfo] = useState(null);
  const { id: groupId } = useParams();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setCurrentUser(JSON.parse(userData));
    }
  }, []);

  const sender_id = currentUser?.id;
  const group_id = parseInt(groupId);

  // Fetch group messages
  useEffect(() => {
    if (!group_id) return;
    const fetchGroupMessages = async () => {
      try {
        const res = await apiClient.getGroupMessages(group_id);
        setMessages(res);
      } catch (err) {
        console.error('Error fetching group messages:', err);
      }
    };
    fetchGroupMessages();
  }, [group_id]);

  // Socket listeners
  useEffect(() => {
    if (!sender_id) return;

    socket.emit('register', { user_id: sender_id });

    const handleReceiveGroupMessage = (data) => {
      if (data.group_id === group_id) {
        setMessages((prev) => [...prev, data]);
      }
    };

    const handleReactionAdded = (data) => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === data.messageId ? { ...msg, reactions: data.reactions } : msg
        )
      );
    };

    socket.on('receive-group-message', handleReceiveGroupMessage);
    socket.on('reaction-added', handleReactionAdded);

    return () => {
      socket.off('receive-group-message', handleReceiveGroupMessage);
      socket.off('reaction-added', handleReactionAdded);
    };
  }, [group_id, sender_id]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const newMsg = {
      text: inputMessage,
      sender_id,
      group_id,
    };

    socket.emit('send-group-message', newMsg);
    setInputMessage('');
  };

  if (!currentUser) return <div>Please log in to access group chat.</div>;

  return (
    <div className={styles.chatContainer}>
      <div className={styles.header}>
        <h3>Group Chat - Group {group_id}</h3>
        <p>You are: {currentUser.username}</p>
      </div>

      <div className={styles.messagesContainer}>
        {messages.length === 0 ? (
          <div className={styles.noMessages}>No messages in this group yet.</div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`${styles.message} ${
                msg.sender_id === sender_id ? styles.sent : styles.received
              }`}
            >
              <div className={styles.messageContent}>
                <p>
                  <strong>{msg.username}:</strong> {msg.text}
                </p>
                <span className={styles.timestamp}>
                  {new Date(msg.created_at).toLocaleTimeString()}
                </span>
                <div className={styles.buttonContainer}>
                  <ActionButton
                    messageId={msg.id}
                    senderId={msg.sender_id}
                    currentUserId={sender_id}
                    message={msg}
                  />
                  <ReactButton
                    messageId={msg.id}
                    currentUserId={sender_id}
                    reactions={msg.reactions}
                  />
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <form onSubmit={handleSendMessage} className={styles.messageForm}>
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Type a group message..."
          className={styles.messageInput}
        />
        <button type="submit" className={styles.sendButton}>
          Send
        </button>
      </form>
    </div>
  );
}

export default GroupChatPage;


