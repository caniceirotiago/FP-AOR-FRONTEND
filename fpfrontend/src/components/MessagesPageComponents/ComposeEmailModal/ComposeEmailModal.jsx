import React, { useState, useEffect, useRef } from 'react';
import { MessageBox } from 'react-chat-elements';
import Select from 'react-select';
import 'react-chat-elements/dist/main.css';
import styles from './ComposeEmailModal.module.css';
import generalService from '../../../services/generalService';

const ComposeEmailModal = ({ onClose, messages, sendMessage, selectedUser, users }) => {
  const [inputText, setInputText] = useState('');
  const [subject, setSubject] = useState(''); 
  const [currentUser, setCurrentUser] = useState(selectedUser || null);
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView();
  };

  const fetchSuggestedUsers = async (firstLetter) => {
    try {
      const response = await generalService.fetchSuggestions('users', firstLetter);
      const data = await response.json();
      setSuggestedUsers(data);
    } catch (error) {
      console.error('Error fetching suggestions:', error.message);
    }
  };

  const handleInputChange = (newValue) => {
    setInputValue(newValue);

    if (newValue.length === 1) {
      fetchSuggestedUsers(newValue);
    } else {
      const filteredUsers = suggestedUsers.filter(user =>
        user.username.toLowerCase().startsWith(newValue.toLowerCase())
      );
      setSuggestedUsers(filteredUsers);
    }
  };

  const handleSelectChange = (selectedOption) => {
    if (selectedOption) {
      setCurrentUser({ id: selectedOption.value, username: selectedOption.label });
    } else {
      setCurrentUser(null);
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (inputText.trim() && subject.trim() && currentUser) {
      const newMessage = {
        senderId: localStorage.getItem('userId'),
        recipientId: currentUser.id,
        content: inputText,
        subject: subject 
      };
      sendMessage(newMessage);
      setInputText('');
      setSubject(''); // Limpar o campo de assunto após o envio
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <button className={styles.closeButton} onClick={onClose}>&times;</button>
        <h2>{currentUser ? `Message to ${currentUser.username}` : 'Select a user'}</h2>
        <Select
          className="react-select-container"
          classNamePrefix="react-select"
          value={currentUser ? { label: currentUser.username, value: currentUser.id } : null}
          onInputChange={handleInputChange}
          onChange={handleSelectChange}
          options={suggestedUsers.map(user => ({ label: user.username, value: user.id }))}
          inputValue={inputValue}
          noOptionsMessage={() => "No suggestions found"}
          placeholder="Type to search users"
          isClearable
        />
        <div className={styles.messagesContainer}>
          {currentUser && (
            <>
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
            </>
          )}
        </div>
        {currentUser && (
          <form onSubmit={handleSendMessage} className={styles.inputArea}>
            <input
              type="text"
              placeholder="Type a subject..."
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className={styles.input}
            />
            <textarea
              placeholder="Type a message..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className={styles.input}
            />
            <button type="submit" className={styles.button}>Send</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ComposeEmailModal;
