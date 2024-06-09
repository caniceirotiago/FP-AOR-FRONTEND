import React from 'react';
import styles from './LogsList.module.css';
import { format, parseISO } from 'date-fns';

const LogsList = ({ logs }) => {
    const formatDate = (dateString) => {
        const date = parseISO(dateString);
        return format(date, 'dd/MM/yyyy HH:mm:ss');
    };
    return (
        <div className={styles.container}>
            <h2>Project Logs</h2>
            <div className={styles.innerContainer}>
                 <div className={styles.existingAttributes}>
                    <div className={styles.userAttributeContainer}>
                        <ul className={styles.attributeList}>
                            {logs.map((log, index) => (
                                <div className={styles.logElement} key={index}>
                                    <div>{log.username}</div>
                                    <div>{formatDate(log.creationDate)}</div>
                                    <div>{log.content}</div>
                                </div>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
    }
export default LogsList;