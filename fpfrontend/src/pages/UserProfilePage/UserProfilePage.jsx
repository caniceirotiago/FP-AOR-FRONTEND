import React from 'react';
import styles from './UserProfilePage.module.css';
import UserProfileBasicElements from '../../components/UserProfilePageComponents/UserProfileBasicElements.jsx';   

const UserProfilePage = () => {
  return (
    <div className={styles.userProfilePage} >
      <UserProfileBasicElements/>
    </div>
  );
};

export default UserProfilePage;
