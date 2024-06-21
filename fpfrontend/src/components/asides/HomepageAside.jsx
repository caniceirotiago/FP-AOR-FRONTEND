// HomepageAside.jsx
import React, { useEffect , useState} from 'react';
import styles from './HomepageAside.module.css';
import useLayoutStore from '../../stores/useLayoutStore';
import { FaBoxes, FaFileContract, FaBriefcase, FaArrowLeft, FaArrowRight, FaCog, FaTags, FaChartLine, FaEnvelope} from 'react-icons/fa';
import { Link } from 'react-router-dom';
import {  FormattedMessage } from "react-intl";
import { FaChartGantt } from "react-icons/fa6";
import { useLocation } from 'react-router-dom';

const HomepageAside = () => {
    const { isAsideExpanded, toggleAside } = useLayoutStore();
    const [showText, setShowText] = useState(false);
    const location = useLocation(); 
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
            <Link to="/authenticatedhomepage" className={`${styles.menuItem} ${location.pathname === '/authenticatedhomepage' ? styles.active : ''}`}>
                    <FaBriefcase className={styles.icon} />
                <span className={showText ? styles.menuText : styles.menuTextHidden}><FormattedMessage id="selectProject">Select Project</FormattedMessage></span>
            </Link>                    
            <Link to="/projectplanning" className={`${styles.menuItem} ${location.pathname === '/projectplanning' ? styles.active : ''}`}>
                <FaChartGantt className={styles.icon} />
                <span className={showText ? styles.menuText : styles.menuTextHidden}><FormattedMessage id="projectPlanning">Project Planning</FormattedMessage></span>
            </Link>
            <Link to="/messages" className={`${styles.menuItem} ${location.pathname === '/messages' ? styles.active : ''}`}>
                <FaEnvelope className={styles.icon} />
                <span className={showText ? styles.menuText : styles.menuTextHidden}><FormattedMessage id="messages">Messages</FormattedMessage></span>
            </Link>
            <Link to="/report" className={`${styles.menuItem} ${location.pathname === '/report' ? styles.active : ''}`}>
                <FaFileContract className={styles.icon} />
                <span className={showText ? styles.menuText : styles.menuTextHidden}><FormattedMessage id="report">Report</FormattedMessage></span>
            </Link>
            <Link to="/inventory" className={`${styles.menuItem} ${location.pathname === '/inventory' ? styles.active : ''}`}>
                <FaBoxes className={styles.icon} />
                <span className={showText ? styles.menuText : styles.menuTextHidden}><FormattedMessage id="inventory">Inventory</FormattedMessage></span>
            </Link>
            <Link to="/settings" className={`${styles.menuItem} ${location.pathname === '/settings' ? styles.active : ''}`}>
                <FaCog className={styles.icon} />
                <span className={showText ? styles.menuText : styles.menuTextHidden}><FormattedMessage id="settings">Settings</FormattedMessage></span>
            </Link>
             
        </aside>
    );
};

export default HomepageAside;
