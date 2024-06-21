import React from 'react';
import styles from './EmailTable.module.css';

const EmailTable = ({ view, messages, onSelectUser }) => {
  const handleMsgClick = (msg) => {
    onSelectUser(msg);
  };

  return (
    <div className={styles.tableContainer}>
      <div className={styles.tblHeader}>
      <table className={styles.table}>
        <thead >
          <tr>
            <th></th>
            <th className={styles.header}>{view === 'inbox' ? 'From' : 'To'}</th>
            <th className={styles.header}>Subject</th>
            <th className={styles.header}>Date</th>
            <th className={styles.header}>Content</th>
          </tr>
        </thead>
        <tbody>
          {messages.map((msg, index) => (
            <tr  className={`${styles.row} ${(!msg.viewed && view === 'inbox') ? styles.notViewed: ''}`} key={index} onClick={() => handleMsgClick(msg)}>
              <td className={styles.cell} ><div className={styles.userPhoto}><img  className={styles.photo}src={view === 'inbox' ? msg.sender.photo : msg.recipient.photo} alt="userPhoto" /></div></td>
              <td className={styles.cell} >{view === 'inbox' ? msg.sender.username : msg.recipient.username}</td>
              <td className={styles.cell} >{msg.subject}</td>
              <td className={styles.cell} >{new Date(msg.sentAt).toLocaleString()}</td>
              <td className={styles.cell} >{msg.content}</td>
            </tr>
          ))}
        </tbody>
      </table>
      
      </div>
    </div>
  );
};

export default EmailTable;
