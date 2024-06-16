import React from 'react';
import styles from './EmailTable.module.css';

const EmailTable = ({ view, messages, onSelectUser }) => {
  console.log('messages:', messages);
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
            <tr key={index} onClick={() => onSelectUser({ id: msg.senderId === localStorage.getItem('userId') ? msg.recipientId : msg.senderId, username: msg.senderId === localStorage.getItem('userId') ? msg.recipientUsername : msg.senderUsername })}>
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
