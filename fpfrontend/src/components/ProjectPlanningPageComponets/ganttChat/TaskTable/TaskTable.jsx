import React from 'react';
import styles from './TaskTable.module.css';

const TaskTable = ({ tasks }) => {
  return (
    <div className={styles.taskTable}>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Start Date</th>
            <th>End Date</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task.id} className={styles.tr}>
              <td className={styles.td}>{task.id}</td>
              <td className={styles.td}>{task.title}</td>
              <td className={styles.td}>{task.plannedStartDate}</td>
              <td className={styles.td}>{task.plannedEndDate}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TaskTable;
