import React, { useCallback, useEffect } from 'react';
import HomepageHeader from '../../components/headers/HomepageHeader';
import styles from './AuthLayout.module.css';


const AuthLayout = ({ children }) => {


    return (
        <div className={styles.main}>
         <div className={styles.board}>
            {children}
         </div>
        </div>
    );
};

export default AuthLayout;
