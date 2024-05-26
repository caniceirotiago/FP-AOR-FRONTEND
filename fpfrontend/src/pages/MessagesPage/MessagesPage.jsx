import React from 'react';
import styles from './MessagesPage.module.css';
import AttributeEditor from '../../components/reactSelect/AttributeEditor';

const MessagesPage = () => {
  // Just to test hasAccess
  const hasAccess = true;
  return (
    <div className={styles.MessagesPage} >
      <AttributeEditor title="skills" hasAccess={hasAccess}/>
    </div>
  );
};

export default MessagesPage;
