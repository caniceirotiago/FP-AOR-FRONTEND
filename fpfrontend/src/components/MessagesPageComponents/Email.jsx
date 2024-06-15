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

  const handleComposeClick = () => {
    setSelectedUser(null);
    setComposeModalOpen(true);
  };


  const fetchMessages = async (userId) => {
    // Substitua pelo código para buscar mensagens entre os usuários
    const fetchedMessages = []; // Simulação de mensagens
    setMessages(fetchedMessages);
  };

  useEffect(() => {
    if (selectedUser) {
      fetchMessages(selectedUser.id);
    }
  }, [selectedUser]);

  const sendMessage = async (message) => {
    const oldMessages = messages;
    setMessages((prevMessages) => [...prevMessages, message]);
    const response = await individualMessageService.sendMessage(message);
    if (!response.ok) {
      setMessages(oldMessages);
    }
    console.log('response:', response);
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
          <EmailTable view={view} onSelectUser={(user) => {
            setSelectedUser(user);
            setComposeModalOpen(true);
          }} />
        </div>
        {isComposeModalOpen && (
          <ComposeEmailModal
            onClose={() => setComposeModalOpen(false)}
            messages={messages}
            sendMessage={sendMessage}
            selectedUser={selectedUser}
            users={users}
          />
        )}
      </div>

  );
};

export default Email;
