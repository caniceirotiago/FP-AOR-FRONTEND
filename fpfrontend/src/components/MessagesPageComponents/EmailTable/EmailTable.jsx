import React from 'react';
import styles from './EmailTable.module.css';

const EmailTable = ({ view, messages, onSelectUser }) => {
  console.log('messages:', messages);
  const handleMsgClick = (msg) => {
    onSelectUser(msg);
  }
  
  return (
    <div className={styles.tableContainer}>
      <table className={styles.emailTable}>
        <thead>
          <tr>
            <th>{view === 'inbox' ? 'From' : 'To'}</th>
            <th>Subject</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {messages.map((msg, index) => (
            <tr key={index} onClick={() => handleMsgClick(msg)}>
              <td>{view === 'inbox' ? msg.sender.username : msg.recipient.username}</td>
              <td>{msg.subject}</td>
              <td>{new Date(msg.sentAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EmailTable;
