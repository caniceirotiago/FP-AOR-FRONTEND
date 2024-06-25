import React, { useState, useEffect } from "react";
import TaskTable from "./TaskTable/TaskTable";
import GanttChart from "./GanttChart/GanttChart";
import styles from "./TaskManager.module.css";
import taskService from "../../../services/taskService";
import useDeviceStore from "../../../stores/useDeviceStore";
import projectService from "../../../services/projectService";

const TaskManager = ({ projectId, tasksUpdated, handleEditTaskClick }) => {
  const [tasks, setTasks] = useState([]);
  const [projectGeneralInfo, setProjectGeneralInfo] = useState({});
  const { dimensions } = useDeviceStore();

  const fetchProjectTasks = async () => {
    if (!projectId) return;
    try {
      const response = await taskService.getTasksByProjectId(projectId);
      const data = await response.json();
      console.log(data);
      const formattedTasks = data.map((task) => ({
        id: task.id,
        title: task.title,
        plannedStartDate: task.plannedStartDate,
        plannedEndDate: task.plannedEndDate,
        prerequisites: task.prerequisites,
        state: task.state,
        description: task.description,
        registeredExecuters: task.registeredExecuters,
        nonRegisteredUsers: task.nonRegisteredUsers,
        responsible: task.responsibleId,
      }));
      setTasks(formattedTasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const fetchProjectGeneralInfo = async () => {
    try {
      const response = await projectService.getProjectById(projectId);
      const data = await response.json();
      setProjectGeneralInfo(data);
    } catch (error) {
      console.error("Error fetching project General Info:", error);
    }
  };

  useEffect(() => {
    fetchProjectTasks();
    fetchProjectGeneralInfo();
  }, [projectId, tasksUpdated]);

  const addPreresquisiteTaskById = async (
    independentTaskId,
    dependentTaskId
  ) => {
    try {
      const response = await taskService.addPrerequisiteTask(
        independentTaskId,
        dependentTaskId,
        projectId
      );

      if (response.status !== 204) {
        console.error("Error adding prerequisite task:", response);
      }
    } catch (error) {
      console.error("Error adding prerequisite task:", error);
    }
  };
  const removeDependency = async (independentTaskId, dependentTaskId) => {
    console.log(independentTaskId, dependentTaskId);
    try {
      const response = await taskService.removeDependency(
        independentTaskId,
        dependentTaskId,
        projectId
      );
      console.log(response);
      if (response.status !== 204) {
        console.error("Error removing dependency:", response);
      }
    } catch (error) {
      console.error("Error removing dependency:", error);
    }
  };

  const updateTaskById = async (taskId) => {
    try {
      const updatedTask = tasks.find((task) => task.id === taskId);
      console.log(updatedTask);
      const formatToISOString = (date) => {
        const isoString = date.toISOString();
        return isoString.split(".")[0] + "Z";
      };
      const formattedUpdatedTask = {
        taskId: updatedTask.id,
        description: updatedTask.description,
        plannedStartDate: formatToISOString(
          new Date(updatedTask.plannedStartDate)
        ),
        plannedEndDate: formatToISOString(new Date(updatedTask.plannedEndDate)),
        state: updatedTask.state,
      };
      await taskService.updateTask(formattedUpdatedTask, projectId);
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  useEffect(() => {
    fetchProjectTasks();
  }, [projectId]);

  return (
    <div className={styles.container}>
      <div className={styles.projectPlanningHeader}>
        <h3 className={styles.title}>{projectGeneralInfo.name}</h3>
        <p>{projectGeneralInfo.state}</p>
        <span
          className={styles.statusIndicator}
          style={{ backgroundColor: getStatusColor(projectGeneralInfo.state) }}
        >
        </span>
      </div>
      <div className={styles.projectPlanningBody}>
        {dimensions.width > 1250 && (
          <TaskTable
            className={styles.taskTable}
            tasks={tasks}
            handleEditTaskClick={handleEditTaskClick}
          />
        )}
        <GanttChart
          className={styles.ganttChart}
          tasks={tasks}
          setTasks={setTasks}
          updateTaskById={updateTaskById}
          addPreresquisiteTaskById={addPreresquisiteTaskById}
          removeDependency={removeDependency}
          handleEditTaskClick={handleEditTaskClick}
        />
      </div>
    </div>
  );
};

export default TaskManager;

const getStatusColor = (status) => {
  switch (status) {
    case "PLANNING":
      return "var(--color-planning)";
    case "READY":
      return "var(--color-ready)";
    case "IN_PROGRESS":
      return "var(--color-in-progress)";
    case "FINISHED":
      return "var(--color-finished)";
    case "CANCELLED":
      return "var(--color-cancelled)";
    default:
      return "var(--color-default)";
  }
};
