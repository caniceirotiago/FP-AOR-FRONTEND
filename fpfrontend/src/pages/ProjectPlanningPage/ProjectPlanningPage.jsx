import React, {useEffect, useState} from 'react';
import styles from './ProjectPlanningPage.module.css'
import TaskManager from '../../components/ProjectPlanningPageComponets/ganttChat/TaskManager';
import projectService from '../../services/projectService';
import membershipService from '../../services/membershipService';
import { FaPlus, FaFilter } from 'react-icons/fa';
import CreateTaskModal from '../../components/modals/CreateTaskModal';

const ProjectPlanningPage = () => {
  const [accessibleProjectsIds, setAccessibleProjectsIds] = useState([]);
  const [projectId, setProjectId] = useState(2);
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tasksUpdated, setTasksUpdated] = useState(false); 

  const fetchProjetsIdByloggedUser = async () => {
    try {
      const response = await membershipService.getProjectIdsByuserId();
      const data = await response.json();
      setAccessibleProjectsIds(data);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  }

  useEffect(() => {
    fetchProjetsIdByloggedUser();
  }
  , []);

  const toggleFiltersVisibility = () => {
    setFiltersVisible(!filtersVisible);
  };
  const handleClick = () => {
    console.log("clicked");
    setIsModalOpen(true);
  }
  const handleTaskCreated = () => {
    setTasksUpdated(!tasksUpdated); // Atualiza o estado para forçar a atualização das tarefas
  };
 
  return (
    
    <div className={styles.container}>
      
            <div className={styles.controlPanel}>
        <div className={styles.btns}>
        <CreateTaskModal onTaskCreated={handleTaskCreated} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} projectId={projectId}/>
            <button onClick={handleClick} className={`${styles.iconButton} ${styles.createButton}`} data-text="Create">
              <FaPlus  className={styles.svgIcon} />
            </button>

          <button onClick={toggleFiltersVisibility} className={styles.iconButton} data-text="Filter">
            <FaFilter className={styles.svgIcon} />
          </button>
        </div>
        {filtersVisible && (
          <select onChange={(e) => setProjectId(e.target.value)}>
            {accessibleProjectsIds.map((projectId) => (
              <option key={projectId} value={projectId}>
                {projectId}
              </option>
            ))}
          </select>
        )}
      </div>
      <TaskManager projectId={projectId} tasksUpdated={tasksUpdated}/>
    </div>
  );
};

export default ProjectPlanningPage;