import React, { useCallback, useEffect } from 'react';
import HomepageHeader from '../../components/headers/HomepageHeader';
import styles from './MainLayout.module.css';


const MainLayout = ({ children }) => {
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
         <HomepageHeader />
         <div className={styles.board}>
            {/* {dimensions.width >= 768 && <HomepageAside />} */}
            <div className={`${styles.rightContainer} ${false ? '' : styles.expandedRightContainer}`}>
                {children}
            </div>               
         </div>
        {/* {dimensions.width >= 768 ? <HomepageFooter /> : <HomepageMobileFooter />} */}
        </div>
    );
};

export default MainLayout;
