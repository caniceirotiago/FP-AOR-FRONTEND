import React from 'react';
import styles from './RegisterPage.module.css';
import background from '../../assets/background.jpg';
import RegisterForm from '../../components/auth regist/registerForm/RegisterForm';



const RegisterPage = () => {
  return (
    <div className={styles.initialPage} >
      <div className={styles.content}>
        <RegisterForm />
      </div>
    </div>
  );
};

export default RegisterPage;
