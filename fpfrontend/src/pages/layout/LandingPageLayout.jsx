import React, { useCallback, useEffect } from 'react';
import HomepageHeader from '../../components/headers/HomepageHeader';
import styles from './LandingPageLayout.module.css';
import NonAuthHeader from '../../components/headers/NonAuthHeader';
import LandingPageFooter from '../../components/footers/landingPageFooter/LandingPageFooter';


const LandingPageLayout = ({ children }) => {


    return (
        <>       
         
        <div className={styles.main}>
         <NonAuthHeader />    
         <div className={styles.board}>
            {children}
         </div>
        </div>
        <LandingPageFooter />
        </>

    );
};

export default LandingPageLayout;
