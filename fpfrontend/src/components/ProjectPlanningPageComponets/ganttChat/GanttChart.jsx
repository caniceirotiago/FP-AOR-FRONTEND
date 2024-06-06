import React, { useEffect, useRef, useState } from 'react';
import 'dhtmlx-gantt';
import 'dhtmlx-gantt/codebase/dhtmlxgantt.css';
import styles from './GanttChart.module.css';
import projectService from '../../../services/projectService.jsx'

const GanttChart = () => {
  const ganttContainer = useRef(null);
  const [tasks, setTasks] = useState({ data: [], links: [] });

  useEffect(() => {
    
    const fetchTasks = async () => {
      try {
        const response = await projectService.getTasksByProjectId(1); 
        console.log(response)

        const backendTasks = await response.json();
        console.log(backendTasks)
        // Transformar os dados para o formato necessário para o dhtmlx-gantt
        const transformedTasks = backendTasks.map(task => ({
          id: task.id,
          text: task.title,
          start_date: task.plannedStartDate ? new Date(task.plannedStartDate).toISOString().split('T')[0] : null,
          end_date: task.plannedEndDate ? new Date(task.plannedEndDate).toISOString().split('T')[0] : null,
          duration: task.duration,
          progress: 0, // Pode ser ajustado conforme necessário
        }));
        setTasks({ data: transformedTasks, links: [] }); // Adicione links se necessário
      } catch (error) {
        console.error('Erro ao buscar tarefas:', error);
      }
    };

    fetchTasks();

    if (ganttContainer.current) {
      window.gantt.config.date_format = "%Y-%m-%d";
      window.gantt.config.scale_unit = "day";
      window.gantt.config.date_scale = "%d %M";
      window.gantt.config.scale_height = 50;
      window.gantt.config.min_column_width = 50;
      window.gantt.config.subscales = [
        { unit: "hour", step: 1, date: "%H" }
      ];
      window.gantt.init(ganttContainer.current);
    }

    return () => {
      if (ganttContainer.current) {
        window.gantt.clearAll();
      }
    };
  }, []);

  useEffect(() => {
    if (ganttContainer.current) {
      window.gantt.clearAll();
      window.gantt.parse(tasks);
    }
  }, [tasks]);

  return (
    <div className={styles.ganttContainer} ref={ganttContainer}></div>
  );
};

export default GanttChart;
