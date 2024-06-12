import React, { useRef, useState, useEffect } from 'react';
import styles from './GanttChart.module.css';

const GanttChart = ({ tasks, setTasks, updateTaskById, addPreresquisiteTaskById, removeDependency }) => {
  const ganttRef = useRef(null);
  const [draggingTask, setDraggingTask] = useState(null);
  const [activeDependency, setActiveDependency] = useState(null);
  const [linePosition, setLinePosition] = useState(null);
  const [circleDragHoovered, setCircleDragHoovered] = useState(null);



  const startDate = new Date(Math.min(...tasks.map(task => new Date(task.plannedStartDate))));
  const endDate = new Date(Math.max(...tasks.map(task => new Date(task.plannedEndDate))));
  const totalDays = (endDate - startDate) / (1000 * 60 * 60 * 24);

  const handleDragStart = (e, taskId, type, handleType) => {
    const ganttRect = ganttRef.current.getBoundingClientRect();
    e.dataTransfer.setData('sourceTaskId', taskId);
    e.dataTransfer.setData('type', type);
    e.dataTransfer.setData('handleType', handleType);
    setDraggingTask({ 
      taskId, 
      type, 
      handleType, 
      initialX: e.clientX - ganttRect.left, 
      initialY: e.clientY - ganttRect.top 
    });
    if (handleType === 'dependency') {
      setActiveDependency({ taskId, type });
    }
    e.dataTransfer.setDragImage(new Image(), 0, 0); // Evita o ícone de arrasto padrão
  };

  const handleDrag = (e) => {
    if (!draggingTask || e.clientX === 0) return;

    const { taskId, type, initialX, initialY, handleType } = draggingTask;
    const ganttRect = ganttRef.current.getBoundingClientRect();

    if (handleType === 'dependency') {
      setLinePosition({ 
        startX: initialX, 
        startY: initialY, 
        endX: e.clientX - ganttRect.left, 
        endY: e.clientY - ganttRect.top 
      });
      return;
    }

    const deltaX = e.clientX - (ganttRect.left + initialX);
    const dayOffset = deltaX / 40; // Cada dia tem 40px de largura
    const roundedDayOffset = Math.round(dayOffset);

    if (Math.abs(dayOffset) >= 1) {
      const updatedTasks = tasks.map(task => {
        if (task.id === taskId) {
          const taskStartDate = new Date(task.plannedStartDate);
          const taskEndDate = new Date(task.plannedEndDate);
          const newStartDate = new Date(taskStartDate.getTime() + roundedDayOffset * (1000 * 60 * 60 * 24));
          const newEndDate = new Date(taskEndDate.getTime() + roundedDayOffset * (1000 * 60 * 60 * 24));

          if (type === 'bar') {
            return validateTaskUpdate(task, newStartDate, newEndDate);
          } else if (type === 'start') {
            return validateTaskUpdate(task, newStartDate, taskEndDate, true);
          } else if (type === 'end') {
            return validateTaskUpdate(task, taskStartDate, newEndDate, true);
          }
        }
        return task;
      });

      setTasks(updatedTasks);
      setDraggingTask({ ...draggingTask, initialX: e.clientX - ganttRect.left });
    }
  };

  const validateTaskUpdate = (task, newStartDate, newEndDate, isDraggingHandle = false) => {
    const prerequisites = task.prerequisites.map(depId => tasks.find(t => t.id === depId));
    const isValidStartDate = prerequisites.every(dep => newStartDate >= new Date(dep.plannedEndDate));
    const dependentTasks = tasks.filter(t => t.prerequisites.includes(task.id));
    const isValidEndDate = dependentTasks.every(dep => newEndDate <= new Date(dep.plannedStartDate));
    const isValidDuration = newEndDate > newStartDate;

    if (isDraggingHandle && !isValidDuration) {
      return task; 
    }

    if (isValidStartDate && isValidEndDate && isValidDuration) {
      return {
        ...task,
        plannedStartDate: newStartDate.toISOString().split('.')[0] + 'Z',
        plannedEndDate: newEndDate.toISOString().split('.')[0] + 'Z'
      };
    }
    return task;
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const type = e.dataTransfer.getData('type');
    const handleType = e.dataTransfer.getData('handleType');
    const sourceTaskId = Number(e.dataTransfer.getData('sourceTaskId'));
    const targetTaskId = Number(e.target.dataset.taskId);

    if (activeDependency && handleType === 'dependency') {
      const sourceTaskId = Number(e.dataTransfer.getData('sourceTaskId'));
      setCircleDragHoovered(false);
      if (sourceTaskId !== targetTaskId) {
        const sourceTask = tasks.find(task => task.id === sourceTaskId);
        const targetTask = tasks.find(task => task.id === targetTaskId);

        if (sourceTask && targetTask) {
          const sourceEndDate = new Date(sourceTask.plannedEndDate);
          const targetStartDate = new Date(targetTask.plannedStartDate);
          const targetEndDate = new Date(targetTask.plannedEndDate);
          const sourceStartDate = new Date(sourceTask.plannedStartDate);

          if (sourceEndDate <= targetStartDate){
            setTasks(tasks.map(task => {
              if (task.id === targetTaskId) {
                const prerequisites = [...task.prerequisites, sourceTaskId];
                
                return { ...task, prerequisites };
              }
              return task;
            }));
            console.log("sourceTaskId", sourceTaskId);
            addPreresquisiteTaskById(sourceTaskId, targetTaskId);
          } else if (sourceStartDate >= targetEndDate) {
            setTasks(tasks.map(task => {
              if (task.id === sourceTaskId) {
                const prerequisites = [...task.prerequisites, targetTaskId];
                return { ...task, prerequisites };
              }
              return task;
            }));
            console.log("targetTaskId", targetTaskId);
            addPreresquisiteTaskById(targetTaskId, sourceTaskId);
          }
        }
      }
    } else if (handleType === 'handle') {
      try {
        console.log("sourceTaskId", sourceTaskId);
        updateTaskById(sourceTaskId);
      }
      catch (error) {
        console.error("Error updating tasks:", error);
      }
    } 

    setDraggingTask(null);
    setActiveDependency(null);
    setLinePosition(null);
  };

  const handleDependencyDoubleClick = (taskId, depId) => {

    setTasks(tasks.map(task => {
      if (task.id === taskId) {
        const updatedPrerequisites = task.prerequisites.filter(dependency => dependency !== depId);
        return { ...task, prerequisites: updatedPrerequisites };
      }
      return task;
    }));
    removeDependency(depId, taskId);
  };

  const generateTimeline = () => {
    const timeline = [];
    let currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      timeline.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return timeline;
  };
  const  circleDragEnter = () => {
    setCircleDragHoovered(true);
  };
  const  circleDragLeave = () => {
    setCircleDragHoovered(false);
  };

  const timeline = generateTimeline();

  return (
    <div className={styles.mainGanttContainer}>
      <div className={styles.ganttContainer} ref={ganttRef} onDrop={handleDrop} onDragOver={(e) => e.preventDefault()}>
        <div className={styles.timeline}>
          {timeline.map((date, index) => (
            <div key={index} className={styles.timelineDate}>
              {date.toISOString().split('T')[0].slice(5)} {/* Remove o ano */}
            </div>
          ))}
        </div>
        <div className={styles.taskBars}>
          {tasks.map((task, index) => {
            const taskStartDate = new Date(task.plannedStartDate);
            const taskEndDate = new Date(task.plannedEndDate);
            const taskStartOffset = ((taskStartDate - startDate) / (1000 * 60 * 60 * 24)) * 50; // Cada dia tem 50px de largura
            const taskDuration = ((taskEndDate - taskStartDate) / (1000 * 60 * 60 * 24)) * 50; // Cada dia tem 50px de largura

            return (
              <div
                key={task.id}
                className={styles.taskBar}
                data-task-id={task.id}
                style={{
                  left: `${taskStartOffset}px`,
                  width: `${taskDuration}px`,
                  top: `${index * 40}px` // Ajuste a altura da barra
                }}
              >
                <div
                  className={styles.taskHandleStart}
                  draggable
                  onDragStart={(e) => handleDragStart(e, task.id, 'start', 'handle')}
                  onDrag={(e) => handleDrag(e, task.id, 'start')}
                  onDragEnd={handleDrop}
                ></div>
                <div className={styles.taskContent}
                  draggable
                  onDragStart={(e) => handleDragStart(e, task.id, 'bar', 'handle')}
                  onDrag={(e) => handleDrag(e, task.id, 'bar')}
                  onDragEnd={handleDrop}
                >
                  {task.title}
                </div>
                <div
                  className={styles.taskHandleEnd}
                  draggable
                  onDragStart={(e) => handleDragStart(e, task.id, 'end', 'handle')}
                  onDrag={(e) => handleDrag(e, task.id, 'end')}
                  onDragEnd={handleDrop}
                ></div>
                <div
                  className={`${styles.taskCircleStart} ${circleDragHoovered && styles.circleDragHoovered}`}
                  draggable
                  data-task-id={task.id}
                  onDragStart={(e) => handleDragStart(e, task.id, 'start', 'dependency')}
                  onDrag={(e) => handleDrag(e, task.id, 'start')}
                  onDragEnd={handleDrop}
                  onDragEnter={() => circleDragEnter()}
                  onDragLeave={() => circleDragLeave()}
                ></div>
                <div
                  className={`${styles.taskCircleEnd} ${circleDragHoovered && styles.circleDragHoovered}`}
                  draggable
                  data-task-id={task.id}
                  onDragStart={(e) => handleDragStart(e, task.id, 'end', 'dependency')}
                  onDrag={(e) => handleDrag(e, task.id, 'end')}
                  onDragEnd={handleDrop}
                  onDragEnter={() => circleDragEnter()}
                  onDragLeave={() => circleDragLeave()}
                ></div>
              </div>
            );
          })}
          {linePosition && (
            <div
              className={styles.temporaryDependencyLine}
              style={{
                left: `${linePosition.startX}px`,
                top: `${linePosition.startY - 25}px`,
                width: `${Math.sqrt(Math.pow(linePosition.endX - linePosition.startX, 2) + Math.pow(linePosition.endY - linePosition.startY, 2))}px`,
                transform: `rotate(${Math.atan2(linePosition.endY - linePosition.startY, linePosition.endX - linePosition.startX)}rad)`
              }}
            ></div>
          )}
        </div>
        {/* Renderizar linhas de dependência fixas */}
        <div className={styles.svgContainer}>
          {tasks.map((task) =>
            task.prerequisites.map((depId) => {
              const depTask = tasks.find((t) => t.id === depId);
              if (!depTask) return null;

              const depEndDate = new Date(depTask.plannedEndDate);
              const taskStartDate = new Date(task.plannedStartDate);

              const depEndOffset = ((depEndDate - startDate) / (1000 * 60 * 60 * 24)) * 50;
              const taskStartOffset = ((taskStartDate - startDate) / (1000 * 60 * 60 * 24)) * 50;
              const depIndex = tasks.findIndex((t) => t.id === depId);
              const taskIndex = tasks.findIndex((t) => t.id === task.id);

              return (
                <React.Fragment key={`${task.id}-${depId}`}>
                  <svg
                    className={`${styles.fixedDependencyLine} ${styles.verticalLine}`}
                    style={{
                      position: 'absolute',
                      left: `${depEndOffset - 20}px`,
                      top: `${Math.min(depIndex, taskIndex) * 40 + 45}px`,
                      width: '5px',
                      height: `${Math.abs((taskIndex - depIndex) * 40)}px`,
                    }}
                  >
                    <line
                      className={styles.fixedLine}
                      x1="0"
                      y1="0"
                      x2="0"
                      y2={`${Math.abs((taskIndex - depIndex) * 40)}`}
                      stroke="red"
                      strokeWidth="6"
                      onDoubleClick={() => handleDependencyDoubleClick(task.id, depId)}
                    />
                  </svg>
                  <svg
                    className={`${styles.fixedDependencyLine} ${styles.horizontalLine}`}
                    style={{
                      position: 'absolute',
                      left: `${Math.min(depEndOffset, taskStartOffset) - 20}px`,
                      top: `${taskIndex * 40 + 45}px`,
                      width: `${Math.abs(taskStartOffset - depEndOffset) + 20}px`,
                      height: '5px',
                    }}
                  >
                    <line
                      className={`${styles.fixedLine}`}
                      x1="0"
                      y1="0"
                      x2={`${Math.abs(taskStartOffset - depEndOffset) + 20}`}
                      y2="0"
                      stroke="red"
                      strokeWidth="6"
                      onDoubleClick={() => handleDependencyDoubleClick(task.id, depId)}
                    />
                  </svg>
                </React.Fragment>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default GanttChart;
