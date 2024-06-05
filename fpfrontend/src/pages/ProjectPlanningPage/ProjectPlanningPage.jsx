import React, { useState } from 'react';
import { Gantt, Task, ViewMode } from 'gantt-task-react';
import 'gantt-task-react/dist/index.css';
import styles from './ProjectPlanningPage.module.css';

const ProjectPlanningPage = () => {
  const initialTasks = [
    {
      start: new Date(2024, 5, 1),
      end: new Date(2024, 5, 10),
      name: 'Task 1',
      id: '1',
      type: 'task',
      progress: 20,
      isDisabled: false,
      project: 'Project 1',
      executant: 'https://via.placeholder.com/30', // URL da imagem do executante
    },
    {
      start: new Date(2024, 5, 11),
      end: new Date(2024, 5, 20),
      name: 'Task 2',
      id: '2',
      type: 'task',
      progress: 40,
      isDisabled: false,
      project: 'Project 1',
      executant: 'https://via.placeholder.com/30', // URL da imagem do executante
    },
    {
      start: new Date(2024, 5, 21),
      end: new Date(2024, 5, 30),
      name: 'Task 3',
      id: '3',
      type: 'task',
      progress: 60,
      isDisabled: false,
      project: 'Project 1',
      executant: 'https://via.placeholder.com/30', // URL da imagem do executante
    },
  ];

  const [tasks, setTasks] = useState(initialTasks);
  const [viewMode, setViewMode] = useState(ViewMode.Week);

  const addTask = () => {
    const newTask = {
      start: new Date(2024, 6, 1),
      end: new Date(2024, 6, 10),
      name: `Task ${tasks.length + 1}`,
      id: (tasks.length + 1).toString(),
      type: 'task',
      progress: 0,
      isDisabled: false,
      project: 'Project 1',
      executant: 'https://via.placeholder.com/30', // URL da imagem do executante
    };
    setTasks([...tasks, newTask]);
  };

  const handleTaskChange = (task) => {
    const updatedTasks = tasks.map(t => (t.id === task.id ? task : t));
    setTasks(updatedTasks);
  };

  const renderTaskContent = (task) => {
    return (
      <g key={task.id}>
        <rect
          x={task.x}
          y={task.y}
          width={task.x2 - task.x1}
          height="10"
          fill="blue"
        />
        <image
          href={task.executant}
          x={task.x1 - 24}
          y={task.y - 4}
          height="24px"
          width="24px"
        />
        <text
          x={(task.x2 + task.x1) / 2}
          y={task.y + 15}
          fill="#fff"
          alignmentBaseline="middle"
          textAnchor="middle"
        >
          {task.name}
        </text>
      </g>
    );
  };

  return (
    <div className={styles.ProjectPlanningPage}>
      <h1>Project Planning Page</h1>
      <button onClick={addTask}>Add Task</button>
      <select onChange={(e) => setViewMode(e.target.value)} value={viewMode}>
        <option value={ViewMode.Day}>Day</option>
        <option value={ViewMode.Week}>Week</option>
        <option value={ViewMode.Month}>Month</option>
      </select>
      <Gantt
        tasks={tasks}
        viewMode={viewMode}
        onDateChange={handleTaskChange}
        onProgressChange={handleTaskChange}
        onDoubleClick={(task) => console.log('Double click on task', task)}
        renderBar={(task) => renderTaskContent(task)}
      />
    </div>
  );
};

export default ProjectPlanningPage;
