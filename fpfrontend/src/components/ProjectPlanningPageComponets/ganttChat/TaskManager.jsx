import React, { useState, useEffect } from 'react';
import TaskTable from './TaskTable/TaskTable';
import GanttChart from './GanttChart/GanttChart';
import styles from './TaskManager.module.css';
import taskService from '../../../services/taskService';


const TaskManager = ({projectId}) => {
  const [tasks, setTasks] = useState( []);


  const fetchProjectTasks = async () => {
    try {
      const response = await taskService.getTasksByProjectId(projectId);
      const data = await response.json();
      console.log(data);
      const formattedTasks = data.map(task => ({
        id: task.id,
        title: task.title,
        plannedStartDate: task.plannedStartDate,
        plannedEndDate: task.plannedEndDate,
        prerequisites: task.prerequisites,
        state: task.state,
        description: task.description,
        registeredExecuters: task.registeredExecuters,
        nonRegisteredUsers: task.nonRegisteredUsers,
      }));
      setTasks(formattedTasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  }
  useEffect(() => {
    fetchProjectTasks();
  }
  , [projectId])

  const addPreresquisiteTaskById = async (independentTaskId, dependentTaskId) => {
    try {
      const response = await taskService.addPrerequisiteTask(independentTaskId, dependentTaskId, projectId);
      
      if (response.status !== 204) {
        console.error("Error adding prerequisite task:", response);
      }
      
    } catch (error) {
      console.error("Error adding prerequisite task:", error);
    }
  }
  const removeDependency = async (independentTaskId, dependentTaskId) => {
    console.log(independentTaskId, dependentTaskId);
    try {
      const response = await taskService.removeDependency(independentTaskId, dependentTaskId, projectId);
      console.log(response);
      if (response.status !== 204) {
        console.error("Error removing dependency:", response);
      }
    } catch (error) {
      console.error("Error removing dependency:", error);
    }
  }



  const updateTaskById = async (taskId) => {
    try {
      const updatedTask = tasks.find(task => task.id === taskId);
      console.log(updatedTask);
      const formatToISOString = (date) => {
        const isoString = date.toISOString();
        return isoString.split('.')[0] + 'Z'; 
      };
      const formattedUpdatedTask = {
        taskId: updatedTask.id,
        description: updatedTask.description,
        plannedStartDate: formatToISOString(new Date(updatedTask.plannedStartDate)),
        plannedEndDate: formatToISOString(new Date(updatedTask.plannedEndDate)),
        state: updatedTask.state,
      };
      await taskService.updateTask(taskId, formattedUpdatedTask, projectId);

    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  useEffect(() => {
    fetchProjectTasks();
  }, [projectId]);





  console.log(tasks);
  return (
    <div className={styles.container}>
      <TaskTable tasks={tasks} />
      <GanttChart 
         tasks={tasks} 
         setTasks={setTasks}
          updateTaskById={updateTaskById} 
          addPreresquisiteTaskById={addPreresquisiteTaskById} 
          removeDependency={removeDependency}/>
    </div>
  );
};

export default TaskManager;
