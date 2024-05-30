import react from 'react';
import styles from './ListItem.module.css';

const ListItem = ({ title, attribute }) => {

    return (
        <>
            <div className={styles.attributeName}>{attribute.name}</div>
            <div className={styles.attributeValue}>{attribute.type}</div>
        </>
    );
    };

export default ListItem;