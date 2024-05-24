import React from 'react';
import styles from './MessagesPage.module.css';
import AttributeEditor from '../../components/reactSelect/AttributeEditor';

const MessagesPage = () => {
  return (
    <div className={styles.MessagesPage} >
      
      <AttributeEditor title="skills" />
    </div>
  );
};

export default MessagesPage;
