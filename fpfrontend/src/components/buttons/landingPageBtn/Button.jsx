import React from 'react';
import styles from './Button.module.css';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';

const Button = ({ path, tradId, defaultText }) => {
    return (
        <button className={styles.button}>
            <Link to={path} className={styles.buttonLink}><FormattedMessage id={tradId}>{defaultText}</FormattedMessage></Link>
        </button>
    );
}

export default Button;
