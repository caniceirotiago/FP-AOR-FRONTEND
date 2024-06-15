import React, { useState, useEffect, useRef } from 'react';
import { MessageBox } from 'react-chat-elements';
import 'react-chat-elements/dist/main.css';
import styles from './ComposeEmailModal.module.css';

const ComposeEmailModal = ({ onClose, messages, sendMessage, selectedUser, users }) => {
  const [inputText, setInputText] = useState('');
  const [currentUser, setCurrentUser] = useState(selectedUser || null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (inputText.trim() && currentUser) {
      const newMessage = {
        senderId: sessionStorage.getItem('userId'), // Supondo que você armazena o ID do usuário no sessionStorage
        recipientId: currentUser.id,
        content: inputText,
        subject: "No Subject", // Pode ser modificado conforme necessário
        sentAt: new Date().toISOString(),
      };
      sendMessage(newMessage);
      setInputText('');
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <button className={styles.closeButton} onClick={onClose}>&times;</button>
        <h2>{currentUser ? `Chat with ${currentUser.username}` : 'Select a user to chat with'}</h2>

          <>
            <div className={styles.messagesContainer}>
              {messages.map((msg, index) => (
                <MessageBox
                  key={index}
                  position={msg.senderId === sessionStorage.getItem('userId') ? 'right' : 'left'}
                  type="text"
                  text={msg.content}
                  date={new Date(msg.sentAt)}
                  title={msg.senderUsername}
                />
              ))}
              <div ref={messagesEndRef} />
            </div>
            <select 
                onChange={(e) => setCurrentUser(users.find(user => user.id === parseInt(e.target.value)))}
                defaultValue=""
                className={styles.selectUser}
              >
                <option value="" disabled>Select a user</option>
                {users.map(user => (
                  <option key={user.id} value={user.id}>{user.username}</option>
                ))}
            </select>
            
            <form onSubmit={handleSendMessage} className={styles.inputArea}>
              <input
                type="text"
                placeholder="Type a message..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className={styles.input}
              />
              <button type="submit" className={styles.button}>Send</button>
            </form>
          </>
      </div>
    </div>
  );
};

export default ComposeEmailModal;
