import React, { useEffect, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { FaPlus } from "react-icons/fa";
import styles from "./ProjectPlanningPage.module.css";
import TaskManager from "../../components/ProjectPlanningPageComponets/ganttChat/TaskManager";
import membershipService from "../../services/membershipService";
import useProjectStore from "../../stores/useProjectStore";
import CreateTaskModal from "../../components/modals/CreateTaskModal";
import EditTaskModal from "../../components/modals/EditTaskModal";
import usePlanningPageStore from "../../stores/usePlanningPageStore";
import { Link } from "react-router-dom";
import { FaInfoCircle } from "react-icons/fa";


const ProjectPlanningPage = () => {
  const { isThePlanEditable } = usePlanningPageStore();
  const [accessibleProjectsIds, setAccessibleProjectsIds] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditTaskModalOpen, setIsEditTaskModalOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [tasksUpdated, setTasksUpdated] = useState(false);
  const { selectedProjectId, setSelectedProjectId } = useProjectStore();
  const intl = useIntl();

  // Function to fetch projects accessible by logged-in user
  const fetchProjetsIdByloggedUser = async () => {
    let userId = localStorage.getItem("userId");
    try {
      const response = await membershipService.getProjectsByuserId(userId);
      const data = await response.json();
      console.log(data);
      setAccessibleProjectsIds(data);
      if (!selectedProjectId && data.length > 0) {
        setSelectedProjectId(data[0].id);
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  // Fetch projects on component mount and when selectedProjectId changes
  useEffect(() => {
    fetchProjetsIdByloggedUser();
  }, [selectedProjectId]);

  // Handler for opening create task modal
  const handleClick = () => {
    setIsModalOpen(true);
  };

  // Handler for opening edit task modal
  const handleEditTaskClick = (taskId) => {
    setSelectedTaskId(taskId);
    setIsEditTaskModalOpen(true);
  };

  // Callback for when a task is created (to trigger update)
  const handleTaskCreated = () => {
    setTasksUpdated(!tasksUpdated);
  };

  // Callback for when a task is updated (to trigger update)
  const handleTaskUpdate = () => {
    setTasksUpdated(!tasksUpdated);
  };

  // Handler for selecting a different project
  const handleSelectProject = (e) => {
    setSelectedProjectId(e.target.value);
  };
  
  
  return (
    <div className={styles.container}>
      {(accessibleProjectsIds && accessibleProjectsIds.length === 0) ?
          <div className={styles.noProjects}>
          <FaInfoCircle size={50} style={{ color: "orange", marginBottom: "20px" }} />
          <h1>
            <FormattedMessage id="noProjectsAvailable" defaultMessage="No Projects Available" />
          </h1>
          <p>
            <FormattedMessage id="noProjectsAvailableMessage" defaultMessage="You currently do not have access to any projects. Please ask to join one project or create one." />
          </p>
          <Link to="/authenticatedhomepage" className={styles.backButton}>
            <FormattedMessage id="goToHomePage" defaultMessage="Go to Home" />
          </Link>
        </div>
        :<>
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
          {isThePlanEditable && (
            <button
              onClick={handleClick}
              className={`${styles.iconButton} ${styles.createButton}`}
              data-text={intl.formatMessage({ id: "task" })}
            >
              <FaPlus className={styles.svgIcon} />
            </button>
          )}
        </div>
        <div className={styles.selectProjectDiv}>
          <h4>
            <FormattedMessage
              id="changeProject"
              defaultMessage="Change Project"
            />
          </h4>
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
        <div className={styles.btns}></div>
      </div>
      <TaskManager
        className={styles.taskManager}
        handleEditTaskClick={handleEditTaskClick}
        projectId={selectedProjectId}
        tasksUpdated={tasksUpdated}
      />
    </>
    }
     </div>
  );
};

export default ProjectPlanningPage;
