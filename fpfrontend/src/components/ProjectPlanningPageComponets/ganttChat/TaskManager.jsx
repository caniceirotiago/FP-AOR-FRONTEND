import React, { useState } from 'react';
import TaskTable from './TaskTable/TaskTable';
import GanttChart from './GanttChart/GanttChart';
import styles from './TaskManager.module.css';

const TaskManager = () => {
  const [tasks, setTasks] = useState([
    { id: 1, name: 'Task 1', start: '2023-06-01', end: '2023-06-10', dependencies: [] },
    { id: 2, name: 'Task 2', start: '2023-06-05', end: '2023-06-9', dependencies: [] },
    { id: 4, name: 'Task 4', start: '2023-06-10', end: '2023-06-20', dependencies: [2] },
    { id: 5, name: 'Task 5', start: '2023-06-10', end: '2023-06-20', dependencies: [2] },
    { id: 6, name: 'Task 6', start: '2023-06-10', end: '2023-06-20', dependencies: [2] },
  ]);

  console.log(tasks);
  return (
    <div className={styles.container}>
      <TaskTable tasks={tasks} />
      <GanttChart tasks={tasks} setTasks={setTasks} />
    </div>
  );
};

export default TaskManager;
