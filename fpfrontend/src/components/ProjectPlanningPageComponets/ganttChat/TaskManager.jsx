import React, { useState } from 'react';
import TaskTable from './TaskTable/TaskTable';
import GanttChart from './GanttChart/GanttChart';
import styles from './TaskManager.module.css';

const TaskManager = () => {
  const [tasks, setTasks] = useState([
    { id: 1, name: 'Task 1', start: '2023-06-01', end: '2023-06-10' },
    { id: 2, name: 'Task 2', start: '2023-06-05', end: '2023-06-15' },
    { id: 3, name: 'Task 3', start: '2023-06-10', end: '2023-06-20' },
  ]);

  return (
    <div className={styles.container}>
      <TaskTable tasks={tasks} />
      <GanttChart tasks={tasks} setTasks={setTasks} />
    </div>
  );
};

export default TaskManager;
