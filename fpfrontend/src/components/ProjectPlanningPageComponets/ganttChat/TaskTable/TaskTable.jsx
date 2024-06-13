import React from 'react';
import styles from './TaskTable.module.css';
import { format } from 'date-fns';

const TaskTable = ({ tasks }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return format(date, 'dd/MM/yyyy'); 
  };
  return (
    <div className={styles.taskTable}>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Start Date</th>
            <th>End Date</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task.id} className={styles.tr}>
              <td className={styles.td}>{task.title}</td>
              <td className={styles.td}>{formatDate(task.plannedStartDate)}</td>
              <td className={styles.td}>{formatDate(task.plannedEndDate)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TaskTable;
