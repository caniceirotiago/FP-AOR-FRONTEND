import React from 'react';
import styles from './HomepageMobileFooter.module.css';
import { FaBoxes, FaFileContract, FaBriefcase, FaCog, FaTags, FaChartLine, FaEnvelope } from 'react-icons/fa';
import { Link } from 'react-router-dom';

/**
 * HomepageFooter Component
 * 
 * Description:
 * Renders a footer component for the homepage with icon-only navigation links.
 * 
 * External Dependencies:
 * - react-icons/fa: Provides icons used within the footer component.
 * - react-router-dom: Enables navigation to different pages within the application.
 * 
 * Usage:
 * It displays various menu items for different functionalities as icons without text.
 */

const HomepageFooter = () => {
    return (
        <footer className={styles.footer}>
            <Link to="/authenticatedhomepage" className={styles.menuItem}>
                <FaBriefcase className={styles.icon} />
            </Link>
            <Link to="/projectplanning" className={styles.menuItem}>
                <FaChartLine className={styles.icon} />
            </Link>
            <Link to="/messages" className={styles.menuItem}>
                <FaEnvelope className={styles.icon} />
            </Link>
            <Link to="/report" className={styles.menuItem}>
                <FaFileContract className={styles.icon} />
            </Link>
            <Link to="/inventory" className={styles.menuItem}>
                <FaBoxes className={styles.icon} />
            </Link>
            <Link to="/settings" className={styles.menuItem}>
                <FaCog className={styles.icon} />
            </Link>
        </footer>
    );
};

export default HomepageFooter;
