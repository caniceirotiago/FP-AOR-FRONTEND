import React, { useState, useEffect, useRef } from 'react';
import { MessageBox } from 'react-chat-elements';
import Select from 'react-select';
import 'react-chat-elements/dist/main.css';
import styles from './ComposeEmailModal.module.css';
import generalService from '../../../services/generalService';
import individualMessageService from '../../../services/individualMessageService';
import { set } from 'date-fns';

const ComposeEmailModal = ({ onClose, initialSelectedUser }) => {
  const [selectedUser, setSelectedUser] = useState(initialSelectedUser);
  const [messagesModal, setMessagesModal] = useState([]);
  const [inputText, setInputText] = useState('');
  const [subject, setSubject] = useState(''); 
  const [currentUser, setCurrentUser] = useState(initialSelectedUser || null);
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
      console.log('suggestedUsers:', data);
    } catch (error) {
      console.error('Error fetching suggestions:', error.message);
    }
  };

  const fetchMessagesModal = async (otherUserId) => {
    const userId = localStorage.getItem('userId');
    try {
      const response = await individualMessageService.fetchMessagesBetweenTwoUsers(userId, otherUserId);
      const data = await response.json();
      console.log('data:', data);
      setMessagesModal(data);
    } catch (error) {
      console.error('Error fetching messages:', error.message);
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
  }, [messagesModal]);

  useEffect(() => {
    if (currentUser) {
      console.log('currentUser:', currentUser);
      fetchMessagesModal(currentUser.id);
    }
  }, [currentUser]);

  useEffect(() => {
    if (initialSelectedUser) {
      console.log('initialSelectedUser:', initialSelectedUser);
      setCurrentUser(initialSelectedUser);
    }
  }, [initialSelectedUser]);

  const sendMessage = async (message) => {
    const oldMessages = messagesModal;
    const formattedMessage = {
      ...message,
      sender: {
        id: message.senderId,
        username: localStorage.getItem('username'), // Supondo que o username do remetente esteja salvo no localStorage
        photo: localStorage.getItem('photo'), // Supondo que a foto do remetente esteja salva no localStorage
      },
      recipient: {
        id: currentUser.id,
        username: currentUser.username,
      },
      sentAt: new Date().toISOString(),
    };
    setMessagesModal((prevMessages) => [...prevMessages, formattedMessage]);
    const response = await individualMessageService.sendMessage(message);
    if (!response.ok) {
      setMessagesModal(oldMessages);
    }
    console.log('response:', response);
  };

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

  console.log('messages', messagesModal);

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
              {messagesModal.map((msg, index) => {
                const userId = localStorage.getItem('userId');
                const isSentByCurrentUser = msg.sender && String(msg.sender.id) === String(userId);
                const displayName = isSentByCurrentUser ? 'You' : msg.sender ? msg.sender.username : 'Unknown';
                const avatar = msg?.sender ? msg.sender.photo : null;
                const text = `${msg.subject ? `${msg.subject}: ` : ''}${msg.content}`;

                return (
                  <MessageBox
                    key={index}
                    avatar={avatar}
                    position={isSentByCurrentUser ? 'right' : 'left'}
                    type="text"
                    date={new Date(msg.sentAt)}
                    title={displayName}
                    text={text}
                  />
                );
              })}
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
