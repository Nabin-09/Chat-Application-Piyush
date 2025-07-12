import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styles from '../css/ChatPage.module.css';
import axios from 'axios';
import socket from '../helper/socket.js';
import ActionButton from './ActionButton';
import ReactButton from './ReactButton';

function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [receiverInfo, setReceiverInfo] = useState(null);
  // const { receiverId } = useParams();
  const { type, id } = useParams();


  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setCurrentUser(JSON.parse(userData));
    }
  }, []);

  const sender_id = currentUser?.id;
  const receiver_id = parseInt(id);

  // Fetch receiver info
  useEffect(() => {
    const fetchReceiverInfo = async () => {
      try {
        const response = await axios.get('http://localhost:8080/userlist/list');
        const receiver = response.data.find(user => user.id === receiver_id);
        setReceiverInfo(receiver);
      } catch (err) {
        console.error('Error fetching receiver info:', err);
      }
    };

    if (receiver_id) {
      fetchReceiverInfo();
    }
  }, [receiver_id]);

  // Fetch existing messages
  useEffect(() => {
    if (!sender_id || !receiver_id) {
      console.warn('Missing sender_id or receiver_id:', { sender_id, receiver_id });
      return;
    }

    const fetchMessages = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/message/history/${sender_id}/${receiver_id}`
        );
        console.log('Fetched messages:', response.data);
        if (Array.isArray(response.data)) {
          setMessages(response.data);
        } else {
          console.error('Invalid response format:', response.data);
          setMessages([]);
        }
      } catch (err) {
        console.error('Error fetching messages:', err.message, err.response?.data);
        setMessages([]);
      }
    };

    fetchMessages();
  }, [sender_id, receiver_id]);

  useEffect(() => {
    console.log('Current messages state:', messages);
  }, [messages]);

  // Socket connection and message handling
  useEffect(() => {
    if (!sender_id) return;

    socket.emit('register', { user_id: sender_id });
    console.log('Registered user with socket:', sender_id);

    const handleReceiveMessage = (data) => {
      console.log('Received message via socket:', data);
      setMessages((prev) => {
        const exists = prev.some(msg => msg.id === data.id);
        return exists ? prev : [...prev, data];
      });
    };

    const handleMessageDeleted = (data) => {
      console.log('Handling message deletion for messageId:', data.messageId);
      setMessages((prev) => prev.filter(msg => msg.id !== data.messageId));
    };

    const handleReactionAdded = (data) => {
      console.log('Reaction added:', data);
      setMessages((prev) =>
        prev.map(msg =>
          msg.id === data.messageId ? { ...msg, reactions: data.reactions } : msg
        )
      );
    };

    const handleMessageForwarded = (data) => {
      console.log('Message forwarded:', data);
      if (data.receiverId === receiver_id) {
        setMessages((prev) => [...prev, data.message]);
      }
    };

    socket.on('receive-message', handleReceiveMessage);
    socket.on('message-deleted', handleMessageDeleted);
    socket.on('reaction-added', handleReactionAdded);
    socket.on('message-forwarded', handleMessageForwarded);

    return () => {
      socket.off('receive-message', handleReceiveMessage);
      socket.off('message-deleted', handleMessageDeleted);
      socket.off('reaction-added', handleReactionAdded);
      socket.off('message-forwarded', handleMessageForwarded);
    };
  }, [sender_id, receiver_id]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (inputMessage.trim() !== '' && sender_id && receiver_id) {
      const newMessage = {
        sender_id,
        receiver_id,
        text: inputMessage,
      };
      socket.emit('message', newMessage);
      setInputMessage('');
    }
  };

  if (!currentUser) {
    return <div>Please log in to access chat.</div>;
  }

  return (
    <div className={styles.chatContainer}>
      <div className={styles.header}>
        <h3>Chat with {receiverInfo?.username || `User ${receiver_id}`}</h3>
        <p>You are: {currentUser.username}</p>
      </div>

      <div className={styles.messagesContainer}>
        {messages.length === 0 ? (
          <div className={styles.noMessages}>No messages yet. Start the conversation!</div>
        ) : (
          messages.map((message, index) => (
            <div
              key={message.id || index}
              className={`${styles.message} ${
                message.sender_id === sender_id ? styles.sent : styles.received
              }`}
            >
              <div className={styles.messageContent}>
                <p>{message.text}</p>
                <span className={styles.timestamp}>
                  {new Date(message.created_at).toLocaleTimeString()}
                </span>
                <div className={styles.buttonContainer}>
                  <ActionButton
                    messageId={message.id}
                    senderId={message.sender_id}
                    currentUserId={sender_id}
                    message={message}
                  />
                  <ReactButton
                    messageId={message.id}
                    currentUserId={sender_id}
                    reactions={message.reactions}
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
          placeholder="Type a message..."
          className={styles.messageInput}
        />
        <button type="submit" className={styles.sendButton}>
          Send
        </button>
      </form>
    </div>
  );
}

export default ChatPage;
