import React, {useEffect, useState} from 'react';
import styles from './ProjectPlanningPage.module.css'
import TaskManager from '../../components/ProjectPlanningPageComponets/ganttChat/TaskManager';
import projectService from '../../services/projectService';
import membershipService from '../../services/membershipService';
import { FaPlus, FaFilter } from 'react-icons/fa';
import CreateTaskModal from '../../components/modals/CreateTaskModal';
import { useParams } from 'react-router-dom';

const ProjectPlanningPage = () => {
  const [accessibleProjectsIds, setAccessibleProjectsIds] = useState([]);
  const [projectId, setProjectId] = useState();
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tasksUpdated, setTasksUpdated] = useState(false); 
  const { projectIdParams } = useParams();
  
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
  , [projectId]);

  const toggleFiltersVisibility = () => {
    setFiltersVisible(!filtersVisible);
  };
  const handleClick = () => {
    console.log("clicked");
    setIsModalOpen(true);
  }
  const handleTaskCreated = () => {
    setTasksUpdated(!tasksUpdated); 
  };
  const handleSelectProject = (e) => {
    setProjectId(e.target.value);
  }

 
  console.log(projectId);
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
          <select onChange={handleSelectProject}>
            <option value="">Select a project</option>
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