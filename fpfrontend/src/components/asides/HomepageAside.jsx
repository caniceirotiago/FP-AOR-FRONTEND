// HomepageAside.jsx
import React, { useEffect , useState} from 'react';
import styles from './HomepageAside.module.css';
import useLayoutStore from '../../stores/useLayoutStore';
import { FaBoxes, FaFileContract, FaBriefcase, FaArrowLeft, FaArrowRight, FaCog, FaTags, FaChartLine, FaEnvelope} from 'react-icons/fa';
import { Link } from 'react-router-dom';
import {  FormattedMessage } from "react-intl";
import  useTranslationsStore  from '../../stores/useTranslationsStore';
import { FaChartGantt } from "react-icons/fa6";

const HomepageAside = () => {
    console.log('HomepageAside');
    const { isAsideExpanded, toggleAside } = useLayoutStore();
    const [showText, setShowText] = useState(false);
    const locale = useTranslationsStore((state) => state.locale);
    useEffect(() => {
        const timer = setTimeout(() => {
            setShowText(isAsideExpanded);
        }, 400); 
        return () => clearTimeout(timer);
    }, [isAsideExpanded]);

    return (
        <aside className={isAsideExpanded ? styles.asideExpanded : styles.asideCollapsed}>
            <button onClick={toggleAside} className={styles.toggleButton}>
                {isAsideExpanded ? <FaArrowLeft /> : <FaArrowRight />}
            </button>
            <Link to="/authenticatedhomepage" className={styles.menuItem}>
                    <FaBriefcase className={styles.icon} />
                <span className={showText ? styles.menuText : styles.menuTextHidden}><FormattedMessage id="selectProject">Select Project</FormattedMessage></span>
            </Link>                    
            <Link to="/projectplanning" className={styles.menuItem}>
                <FaChartGantt className={styles.icon} />
                <span className={showText ? styles.menuText : styles.menuTextHidden}><FormattedMessage id="projectPlanning">Project Planning</FormattedMessage></span>
            </Link>
            <Link to="/messages" className={styles.menuItem}>
                <FaEnvelope className={styles.icon} />
                <span className={showText ? styles.menuText : styles.menuTextHidden}><FormattedMessage id="messages">Messages</FormattedMessage></span>
            </Link>
            <Link to="/report" className={styles.menuItem}>
                <FaFileContract className={styles.icon} />
                <span className={showText ? styles.menuText : styles.menuTextHidden}><FormattedMessage id="report">Report</FormattedMessage></span>
            </Link>
            <Link to="/inventory" className={styles.menuItem}>
                <FaBoxes className={styles.icon} />
                <span className={showText ? styles.menuText : styles.menuTextHidden}><FormattedMessage id="inventory">Inventory</FormattedMessage></span>
            </Link>
            <Link to="/settings" className={styles.menuItem}>
                <FaCog className={styles.icon} />
                <span className={showText ? styles.menuText : styles.menuTextHidden}><FormattedMessage id="settings">Settings</FormattedMessage></span>
            </Link>
             
        </aside>
    );
};

export default HomepageAside;
