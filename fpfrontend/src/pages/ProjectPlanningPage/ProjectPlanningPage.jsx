import React, { useEffect, useState } from "react";
import styles from "./ProjectPlanningPage.module.css";
import TaskManager from "../../components/ProjectPlanningPageComponets/ganttChat/TaskManager";
import projectService from "../../services/projectService";
import membershipService from "../../services/membershipService";
import { FaPlus, FaArrowCircleRight } from "react-icons/fa";
import CreateTaskModal from "../../components/modals/CreateTaskModal";
import useProjectStore from "../../stores/useProjectStore";
import EditTaskModal from "../../components/modals/EditTaskModal";

const ProjectPlanningPage = () => {
  const [accessibleProjectsIds, setAccessibleProjectsIds] = useState([]);
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditTaskModalOpen, setIsEditTaskModalOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [tasksUpdated, setTasksUpdated] = useState(false);
  const { selectedProjectId, setSelectedProjectId } = useProjectStore();

  const fetchProjetsIdByloggedUser = async () => {
    try {
      const response = await membershipService.getProjectIdsByuserId();
      const data = await response.json();
      setAccessibleProjectsIds(data);
      if (!selectedProjectId && data.length > 0) {
        setSelectedProjectId(data[0].id);
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  useEffect(() => {
    fetchProjetsIdByloggedUser();
  }, [selectedProjectId]);

  const handleClick = () => {
    console.log("clicked");
    setIsModalOpen(true);
  };

  const handleEditTaskClick = (taskId) => {
    setSelectedTaskId(taskId);
    setIsEditTaskModalOpen(true);
  };

  const handleTaskCreated = () => {
    setTasksUpdated(!tasksUpdated);
  };

  const handleTaskUpdate = () => {
    setTasksUpdated(!tasksUpdated);
  };

  const handleSelectProject = (e) => {
    setSelectedProjectId(e.target.value);
  };

  return (
    <div className={styles.container}>
      <CreateTaskModal
        onTaskCreated={handleTaskCreated}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        projectId={selectedProjectId}
      />
      <EditTaskModal
        onTaskUpdate={handleTaskUpdate}
        projectId={selectedProjectId}
        isOpen={isEditTaskModalOpen}
        onClose={() => setIsEditTaskModalOpen(false)}
        taskId={selectedTaskId}
      />
      <div className={styles.controlPanel}>
        <div className={styles.btns}>
          <button
            onClick={handleClick}
            className={`${styles.iconButton} ${styles.createButton}`}
            data-text="Task"
          >
            <FaPlus className={styles.svgIcon} />
          </button>
        </div>
        <div className={styles.selectProjectDiv}>
          <h4>Change Project</h4>
          <select
            className={styles.selectProject}
            onChange={handleSelectProject}
            value={selectedProjectId}
          >
            {accessibleProjectsIds.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      <TaskManager
        handleEditTaskClick={handleEditTaskClick}
        projectId={selectedProjectId}
        tasksUpdated={tasksUpdated}
      />
    </div>
  );
};

export default ProjectPlanningPage;
