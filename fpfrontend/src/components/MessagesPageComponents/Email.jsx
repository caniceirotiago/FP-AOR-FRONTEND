import React, { useState, useEffect } from 'react';
import styles from './Email.module.css';
import EmailTable from './EmailTable/EmailTable';
import ComposeEmailModal from './ComposeEmailModal/ComposeEmailModal';
import { FaInbox, FaPaperPlane, FaPlus } from 'react-icons/fa';
import individualMessageService from '../../services/individualMessageService';
import useComposeEmailModal from '../../stores/useComposeEmailModal';

const Email = () => {
  const [view, setView] = useState('inbox');
  const {selectedUser, setSelectedUser, isComposeModalOpen, setComposeModalOpen} = useComposeEmailModal();

  const [messages, setMessages] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [pageCount, setPageCount] = useState(1);
  const [filters, setFilters] = useState({ search: '' });

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    fetchMessages(userId);
  }, [view, pageNumber, pageSize, filters]);

  const fetchMessages = async (userId) => {
    try {
      const data = await individualMessageService.fetchFilteredMessages(userId, view, pageNumber, pageSize, filters);
      setMessages(data.messages);
      const newPageCount = Math.ceil(data.totalMessages / pageSize);
      setPageCount(newPageCount);
      if (newPageCount <= 1) {
        setPageNumber(1);
      }
    } catch (error) {
      console.error('Error fetching messages:', error.message);
    }
  };

  const handleComposeClick = () => {
    setSelectedUser(null);
    setComposeModalOpen(true);
  };

  const handleMsgClick = (msg) => {
    const userId = view === 'inbox' ? msg.sender.id : msg.recipient.id;
    const username = view === 'inbox' ? msg.sender.username : msg.recipient.username;
    setSelectedUser({ id: userId, username: username });
    setComposeModalOpen(true);
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, search: e.target.value });
  };
  console.log(messages);

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
        <input
          type="text"
          placeholder="Search..."
          value={filters.search}
          onChange={handleFilterChange}
          className={styles.searchInput}
        />
      </div>
      <div className={styles.emailTable}>
        <EmailTable
          view={view}
          messages={messages}
          onSelectUser={handleMsgClick}
          pageNumber={pageNumber}
          setPageNumber={setPageNumber}
          pageCount={pageCount}
        />
      </div>
      <div className={styles.pagination}>
          <button onClick={() => setPageNumber(1)} disabled={pageNumber === 1}>
            {"<<"}
          </button>
          <button
            onClick={() => setPageNumber(pageNumber - 1)}
            disabled={pageNumber === 1}
          >
            {"<"}
          </button>
          <button
            onClick={() => setPageNumber(pageNumber + 1)}
            disabled={pageNumber === pageCount}
          >
            {">"}
          </button>
          <button
            onClick={() => setPageNumber(pageCount)}
            disabled={pageNumber === pageCount}
          >
            {">>"}
          </button>
          <span>
            Page{" "}
            <strong>
              {pageNumber} of {pageCount}
            </strong>
          </span>
        </div>
      {isComposeModalOpen && (
        <ComposeEmailModal
          onClose={() => setComposeModalOpen(false)}
          initialSelectedUser={selectedUser}
          isChatModalOpen={isComposeModalOpen}
          setInitialSelectedUser={setSelectedUser}
        />
      )}
    </div>
  );
};

export default Email;
