import React, { useCallback, useEffect } from 'react';
import HomepageHeader from '../../components/headers/HomepageHeader';
import styles from './AuthLayout.module.css';


const AuthLayout = ({ children }) => {
    //const { dimensions, setDimensions, isTouch, deviceType, setDeviceType } = useDeviceStore(); 
    //const { isAsideExpanded } = useLayoutStore();
    // const onNotification = useCallback((notification) => {
    //     console.log("Received notification: ", notification);
    //     useNotificationStore.getState().addNotification(notification.content, notification);
    //   }, []);
    //  const wsUrl = `ws://localhost:8080/projeto5backend/globalws/${sessionStorage.getItem('token')}`; 
    // useGlobalWebSocket(wsUrl, true, onNotification);

    // useEffect(() => {
    // const handleResize = () => {
    //     setDimensions(window.innerWidth, window.innerHeight);
    //     setDeviceType(window.innerWidth < 768 ? 'mobile' : 'desktop'); 
    // };

    // window.addEventListener('resize', handleResize);
    // handleResize();  

    // return () => window.removeEventListener('resize', handleResize);
    // }, [setDimensions, setDeviceType]);

    return (
        <div className={styles.main}>
         <div className={styles.board}>
            {children}
         </div>
        </div>
    );
};

export default AuthLayout;
