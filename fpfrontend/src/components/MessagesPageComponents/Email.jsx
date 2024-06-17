import React, { useState, useEffect } from 'react';
import styles from './Email.module.css';
import EmailTable from './EmailTable/EmailTable';
import ComposeEmailModal from './ComposeEmailModal/ComposeEmailModal';
import { FaInbox, FaPaperPlane, FaPlus } from 'react-icons/fa';
import individualMessageService from '../../services/individualMessageService';

const Email = () => {
  const [view, setView] = useState('inbox');
  const [isComposeModalOpen, setComposeModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (view === 'inbox') {
      fetchReceivedMessages(userId);
    } else if (view === 'sent') {
      fetchSentMessages(userId);
    }
  }, [view]);

  const fetchReceivedMessages = async (userId) => {
    try {
      const response = await individualMessageService.fetchReceivedMessages(userId);
      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.error('Error fetching received messages:', error.message);
    }
  };

  const fetchSentMessages = async (userId) => {
    try {
      const response = await individualMessageService.fetchSentMessages(userId);
      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.error('Error fetching sent messages:', error.message);
    }
  };

  const handleComposeClick = () => {
    setSelectedUser();
    setComposeModalOpen(true);
  };

  const handleMsgClick = (msg) => {

    const userId = view === 'inbox' ? msg.sender.id : msg.recipient.id;
    const username = view === 'inbox' ? msg.sender.username : msg.recipient.username;
    setSelectedUser({id: userId, username: username});
    setComposeModalOpen(true);
    
  };

  return (
      <div className={styles.emailContainer}>
        <div className={styles.controlPanel}>
          <div className={styles.btns}>
            <button
             onClick={() => setView('inbox')}
             className={`${styles.iconButton} ${styles.createButton}`}
              data-text="Inbox">
              <FaInbox className={styles.svgIcon}/> 
            </button>
            <button
              onClick={() => setView('sent')}
              className={`${styles.iconButton} ${styles.createButton}`}
              data-text="Sent">
              <FaPaperPlane className={styles.svgIcon}/> 
            </button>
            <button 
              onClick={handleComposeClick}
              className={`${styles.iconButton} ${styles.createButton}`}
              data-text="Compose">
              <FaPlus className={styles.svgIcon}/> 
            </button>
          </div>

        </div>
        <div className={styles.emailTable}>
        <EmailTable 
          view={view} 
          messages={messages}
          onSelectUser={handleMsgClick} 
        />
        </div>
        {isComposeModalOpen && (
          <ComposeEmailModal
            onClose={() => setComposeModalOpen(false)}
            initialSelectedUser={selectedUser}
          />
        )}
      </div>

  );
};

export default Email;
