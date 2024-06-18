import React, { useState, useEffect, useRef, useMemo } from 'react';
import { MessageBox } from 'react-chat-elements';
import Select from 'react-select';
import 'react-chat-elements/dist/main.css';
import styles from './ComposeEmailModal.module.css';
import generalService from '../../../services/generalService';
import individualMessageService from '../../../services/individualMessageService';
import { set } from 'date-fns';
import useDomainStore from '../../../stores/useDomainStore';
import Cookies from 'js-cookie';
import {useIndividualMessageWebSocket} from '../../../websockets/useIndividualMessageWebSocket';


const ComposeEmailModal = ({ onClose, initialSelectedUser, isChatModalOpen, setInitialSelectedUser }) => {
  const [messagesModal, setMessagesModal] = useState([]);
  const [data, setData] = useState({
    inputText: '',
    subject: '',
    currentUser: null,
  });
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef(null);

  const handleMessage = (message) => {
    console.log("Received message:", message);
  };

  const wsUrl = useMemo(() => {
    if(data.currentUser === null  ) return null;
      const sessionToken = Cookies.get('sessionToken'); 
      const sessionTokenUrl = sessionToken;
      const receiverIdUrl = data.currentUser.id;
      const newWsUrl = `ws://${useDomainStore.getState().domain}/emailChat/${sessionTokenUrl}/${receiverIdUrl}`;
      
    return `${newWsUrl}`;
  }, [data.currentUser]);

  const { sendWsMessage } = useIndividualMessageWebSocket(wsUrl, isChatModalOpen && wsUrl, handleMessage, onClose);

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


  useEffect(() => {
    scrollToBottom();
  }, [messagesModal]);

  useEffect(() => {
    if (data.currentUser) {
      console.log('currentUser:', data.currentUser);
      fetchMessagesModal(data.currentUser.id);
      
      setInitialSelectedUser(null);
    }
    if (initialSelectedUser) {
      setData({ ...data, currentUser: initialSelectedUser });
    }
  }, [data.currentUser]);

  const handleSelectChange = (selectedOption) => {
    if (selectedOption) {
      const selectedUser = suggestedUsers.find(user => user.id === selectedOption.value);
      setData({ ...data, currentUser: selectedUser });
    } else {
      setData({ ...data, currentUser: null });
    }
  };



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
        id: data.currentUser.id,
        username: data.currentUser.username,
      },
      sentAt: new Date().toISOString(),
    };
    setMessagesModal((prevMessages) => [...prevMessages, formattedMessage]);
    sendWsMessage(message);
    // if (!response.ok) {
    //   setMessagesModal(oldMessages);
    // }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (data.inputText.trim() && data.subject.trim() && data.currentUser) {
      const newMessage = {
        senderId: localStorage.getItem('userId'),
        recipientId: data.currentUser.id,
        content: data.inputText,
        subject: data.subject 
      };
      sendMessage(newMessage);
      setData({ ...data, inputText: '', subject: '' });

    }
  };

  console.log('messages', messagesModal);

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <button className={styles.closeButton} onClick={onClose}>&times;</button>
        <h2>{data.currentUser ? `Message to ${data.currentUser.username}` : 'Select a user'}</h2>
        <Select
          className="react-select-container"
          classNamePrefix="react-select"
          value={data.currentUser ? { label: data.currentUser.username, value: data.currentUser.id } : null}
          onInputChange={handleInputChange}
          onChange={handleSelectChange}
          options={suggestedUsers.map(user => ({ label: user.username, value: user.id }))}
          inputValue={inputValue}
          noOptionsMessage={() => "No suggestions found"}
          placeholder="Type to search users"
          isClearable
        />
        <div className={styles.messagesContainer}>
          {data.currentUser && (
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
        {data.currentUser && (
          <form onSubmit={handleSendMessage} className={styles.inputArea}>
            <input
              type="text"
              placeholder="Type a subject..."
              value={data.subject}
              onChange={(e) => setData({ ...data, subject: e.target.value })}
              className={styles.input}
            />
            <textarea
              placeholder="Type a message..."
              value={data.inputText}
              onChange={(e) => setData({ ...data, inputText: e.target.value })}
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
