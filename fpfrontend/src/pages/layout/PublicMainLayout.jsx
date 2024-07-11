import React, { useCallback, useEffect } from 'react';
import HomepageHeader from '../../components/headers/HomepageHeader.jsx';
import styles from './PublicMainLayout.module.css';
import HomepageAside from '../../components/asides/HomepageAside.jsx';
import ProtectedComponent from '../../components/auth regist/ProtectedComponents.jsx';
import useDeviceStore from '../../stores/useDeviceStore.jsx';
import HomepageMobileFooter from '../../components/footers/homePageFooters/homePageMobileFooter/HomepageMobileFooter.jsx';


const PublicMainLayout = ({ children }) => {
    const { dimensions, setDimensions, setDeviceType } = useDeviceStore(); 

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

export default PublicMainLayout;
