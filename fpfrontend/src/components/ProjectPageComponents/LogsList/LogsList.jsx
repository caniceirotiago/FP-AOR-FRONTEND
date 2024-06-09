import React from 'react';
import styles from './LogsList.module.css';

const LogsList = ({ logs }) => {
    return (
        <div className={styles.container}>
            <h2>Project Logs</h2>
            <div className={styles.innerContainer}>
                 <div className={styles.existingAttributes}>
                    <div>
                        {logs.map((log, index) => (
                            <div key={index}>{log.username}</div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
    }
export default LogsList;