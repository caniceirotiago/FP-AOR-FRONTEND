import React from 'react';
import styles from './EmailTable.module.css';

// Simulação de dados
const inboxEmails = [
  { id: 1, subject: 'Welcome!', from: 'admin@example.com', to: 'user@example.com', date: '2023-06-14', senderId: 1, recipientId: 2 },
  // Outros emails
];

const sentEmails = [
  { id: 1, subject: 'Meeting Schedule', from: 'user@example.com', to: 'john@example.com', date: '2023-06-14', senderId: 2, recipientId: 3 },
  // Outros emails
];

const EmailTable = ({ view, onSelectUser }) => {
  const emails = view === 'inbox' ? inboxEmails : sentEmails;

  const handleRowClick = (email) => {
    const user = {
      id: view === 'inbox' ? email.senderId : email.recipientId,
      username: view === 'inbox' ? email.from : email.to,
    };
    onSelectUser(user);
  };



  return (
    <table className={styles.emailTable}>
      <thead>
        <tr>
          <th>{view === 'inbox' ? 'From' : 'To'}</th>
          <th>Subject</th>
          <th>Date</th>
        </tr>
      </thead>
      <tbody>
        {emails.map((email) => (
          <tr key={email.id} onClick={() => handleRowClick(email)}>
            <td>{view === 'inbox' ? email.from : email.to}</td>
            <td>{email.subject}</td>
            <td>{email.date}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default EmailTable;
