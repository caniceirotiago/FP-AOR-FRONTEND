import React from 'react';
import styles from './ProjectPlanningPage.module.css'
import GanttChart from '../../components/ProjectPlanningPageComponets/ganttChat/GanttChart';

const ProjectPlanningPage = () => {
 

  return (
    
    <div className={styles.container}>
      <GanttChart/>
    </div>
  );
};

export default ProjectPlanningPage;