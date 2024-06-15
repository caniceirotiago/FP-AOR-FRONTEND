import React from 'react';
import styles from './MessagesPage.module.css';
import Email from '../../components/MessagesPageComponents/Email';

const MessagesPage = () => {
  return (
    <div className={styles.MessagesPage} >
      <Email/>
    </div>
  );
};

export default MessagesPage;
