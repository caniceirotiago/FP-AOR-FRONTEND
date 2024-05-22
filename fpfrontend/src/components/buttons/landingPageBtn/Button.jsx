import React from 'react';
import styles from './Button.module.css';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';

const Button = ({ path, tradId, defaultText, onClick, backgroundColor, btnColor }) => {
    const buttonStyle = {
        backgroundColor: backgroundColor, 
        color: btnColor, 
        borderColor: btnColor
    };
    return (
        <>
        {onClick ? 
            <button className={styles.button} onClick={onClick} style={buttonStyle}>
                <Link className={styles.buttonLink} style={{ color: btnColor }}>
                    <FormattedMessage id={tradId}>{defaultText}</FormattedMessage>
                </Link>
            </button>
            :

            <button className={styles.button} style={buttonStyle}>
                <Link to={path} className={styles.buttonLink} style={{ color: btnColor }}>
                    <FormattedMessage id={tradId}>{defaultText}</FormattedMessage>
                </Link>
            </button>
        }
        </>
    );
}

export default Button;
