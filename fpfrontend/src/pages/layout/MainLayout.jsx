import React, { useCallback, useEffect } from 'react';
import HomepageHeader from '../../components/headers/HomepageHeader';
import styles from './MainLayout.module.css';
import HomepageAside from '../../components/asides/HomepageAside';
import ProtectedComponent from '../../components/auth regist/ProtectedComponents.jsx';
import useDeviceStore from '../../stores/useDeviceStore';
import HomepageMobileFooter from '../../components/footers/homePageFooters/homePageMobileFooter/HomepageMobileFooter.jsx';


const MainLayout = ({ children }) => {
    const { dimensions, setDimensions, setDeviceType } = useDeviceStore(); 
    //const { isAsideExpanded } = useLayoutStore();
    // const onNotification = useCallback((notification) => {
    //     console.log("Received notification: ", notification);
    //     useNotificationStore.getState().addNotification(notification.content, notification);
    //   }, []);
    //  const wsUrl = `ws://localhost:8080/projeto5backend/globalws/${sessionStorage.getItem('token')}`; 
    // useGlobalWebSocket(wsUrl, true, onNotification);

    useEffect(() => {
    const handleResize = () => {
        setDimensions(window.innerWidth, window.innerHeight);
        setDeviceType(window.innerWidth < 768 ? 'mobile' : 'desktop'); 
    };

    window.addEventListener('resize', handleResize);
    handleResize();  

    return () => window.removeEventListener('resize', handleResize);
    }, [setDimensions, setDeviceType]);

    return (
        <div className={styles.main}>
         <HomepageHeader />
         <div className={styles.board}>
            <ProtectedComponent>{dimensions.width >= 768  && <HomepageAside />}</ProtectedComponent>
            <div className={`${styles.rightContainer} ${false ? '' : styles.expandedRightContainer}`}>
                {children}
            </div>               
         </div>
         <ProtectedComponent>{dimensions.width < 768  && <HomepageMobileFooter />}</ProtectedComponent>
        </div>
    );
};

export default MainLayout;
