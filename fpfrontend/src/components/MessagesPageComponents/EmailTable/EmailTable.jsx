import React from 'react';
import { FormattedMessage } from 'react-intl';
import { FaSmile, FaPlus } from 'react-icons/fa';
import styles from './EmailTable.module.css';

const EmailTable = ({ view, messages, onSelectUser, onComposeClick }) => {
  const handleMsgClick = (msg) => {
    onSelectUser(msg);
  };

  return (
    <div className={styles.tableContainer}>
      <div className={styles.tblHeader}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.header}>
                {view === 'inbox' ? (
                  <FormattedMessage id="from" defaultMessage="From" />
                ) : (
                  <FormattedMessage id="to" defaultMessage="To" />
                )}
              </th>
              <th className={styles.header}>
                <FormattedMessage id="subject" defaultMessage="Subject" />
              </th>
              <th className={styles.header}>
                <FormattedMessage id="date" defaultMessage="Date" />
              </th>
              <th className={styles.header}>
                <FormattedMessage id="content" defaultMessage="Content" />
              </th>
            </tr>
          </thead>
          <tbody>
            {messages.length > 0 ? (
              messages.map((msg, index) => (
                <tr
                  className={`${styles.row} ${(!msg.viewed && view === 'inbox') ? styles.notViewed : ''}`}
                  key={index}
                  onClick={() => handleMsgClick(msg)}
                >
                  <td className={styles.cell}>
                    <img
                      className={styles.photo}
                      src={view === 'inbox' ? msg.sender.photo : msg.recipient.photo}
                      alt="userPhoto"
                    />
                    <span className={styles.username}>
                      {view === 'inbox' ? msg.sender.username : msg.recipient.username}
                    </span>
                  </td>
                  <td className={styles.cell}>{msg.subject}</td>
                  <td className={styles.cell}>{new Date(msg.sentAt).toLocaleString()}</td>
                  <td className={styles.cell}>{msg.content}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className={styles.noMessages}>
                  <FaSmile size={50} style={{ color: "green", marginBottom: "20px" }} />
                  <h2>
                    <FormattedMessage id="noMessages" defaultMessage="No Messages Yet!" />
                  </h2>
                  <p>
                    <FormattedMessage id="noMessagesDescription" defaultMessage="Be the first to send a message and start a conversation!" />
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EmailTable;
