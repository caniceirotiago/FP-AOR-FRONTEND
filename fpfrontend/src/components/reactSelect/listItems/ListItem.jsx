import react from 'react';
import styles from './ListItem.module.css';

const ListItem = ({ title, attribute }) => {



    return (
        <>
        {(title === "keywords") &&
        (
            <>
            <div className={styles.attributeName}>{attribute.name}</div>
            </>
        )}
        {(title === "interests" || title === "skills") &&
        (
            <>
            <div className={styles.attributeName}>{attribute.name}</div>
            <div className={styles.attributeValue}>{attribute.type}</div>
            </>
        )}
        {title === "users" &&
        (
            <>
            <div className={styles.attributePhoto}>
                <img src={attribute.Photo} alt="user" className={styles.photo}/>
            </div>
            <div className={styles.attributeName}>{attribute.username}</div>
            </>
        )}
            
        </>
    );
    };

export default ListItem;