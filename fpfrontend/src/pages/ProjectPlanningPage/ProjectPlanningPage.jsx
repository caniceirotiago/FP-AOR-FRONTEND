import React from 'react';
import styles from './ProjectPlanningPage.module.css'
import TaskManager from '../../components/ProjectPlanningPageComponets/ganttChat/TaskManager';

const ProjectPlanningPage = () => {
 

  return (
    
    <div className={styles.container}>
      <TaskManager/>
    </div>
  );
};

export default ProjectPlanningPage;