import React, { useState, useEffect } from 'react';
import { Body, Container, Button } from '@react-email/components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInbox, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import styles from './Email.module.css';
import EmailTable from './EmailTable/EmailTable';
import ComposeEmailModal from './ComposeEmailModal/ComposeEmailModal';

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

  const createDefaultUsers = () => {
    // Simulação de usuários
    const defaultUsers = [
      { id: 1, username: 'user1' },
      { id: 2, username: 'user2' },
      { id: 3, username: 'user3' },
    ];
    
    setUsers(defaultUsers);
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
    // Substitua pelo código para enviar a mensagem
    setMessages((prevMessages) => [...prevMessages, message]);
  };

  return (
    <Body>
      <Container className={styles.emailContainer}>
        <div className={styles.controlBar}>
          <Button onClick={() => setView('inbox')}>
            <FontAwesomeIcon icon={faInbox} /> Inbox
          </Button>
          <Button onClick={() => setView('sent')}>
            <FontAwesomeIcon icon={faPaperPlane} /> Sent
          </Button>
          <Button onClick={handleComposeClick}>
            <FontAwesomeIcon icon={faPaperPlane} /> Compose Email
          </Button>
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
      </Container>
    </Body>
  );
};

export default Email;
