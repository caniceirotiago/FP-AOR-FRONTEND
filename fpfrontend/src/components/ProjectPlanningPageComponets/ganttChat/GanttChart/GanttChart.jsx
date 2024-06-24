import React, { useRef, useState, useEffect } from 'react';
import styles from './GanttChart.module.css';
import  useDeviceStore  from '../../../../stores/useDeviceStore.jsx';

const barTaskColors = {

    PLANNED: "linear-gradient(45deg, var(--planned-task-color) 0%, var(--task-base-color) 100%)",
    IN_PROGRESS:"linear-gradient(45deg, var(--in-progress-task-color) 0%, var(--task-base-color) 100%)",
    FINISHED:"linear-gradient(45deg, var(--finished-task-color) 0%, var(--task-base-color) 100%)"
}

const GanttChart = ({ tasks, setTasks, updateTaskById, addPreresquisiteTaskById, removeDependency, handleEditTaskClick }) => {
  const ganttRef = useRef(null);
  const [draggingTask, setDraggingTask] = useState(null);
  const [activeDependency, setActiveDependency] = useState(null);
  const [linePosition, setLinePosition] = useState(null);
  const [circleDragHoovered, setCircleDragHoovered] = useState(null);
  const [shiftPressed, setShiftPressed] = useState(false);
  const [scrollPosition, setScrollPosition] = useState({ scrollX: 0, scrollY: 0 });
  const { dimensions, isTouch } = useDeviceStore();

  useEffect(() => {
    const handleScroll = () => {
      const { scrollLeft, scrollTop } = ganttRef.current;
      setScrollPosition({ scrollX: scrollLeft, scrollY: scrollTop });
    };

    const ganttElement = ganttRef.current;
    ganttElement.addEventListener('scroll', handleScroll);

    return () => {
      ganttElement.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Shift') {
        setShiftPressed(true);
      }
    };

    const handleKeyUp = (e) => {
      if (e.key === 'Shift') {
        setShiftPressed(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const startDate = new Date(Math.min(...tasks.map(task => new Date(task.plannedStartDate))));
  const endDate = new Date(Math.max(...tasks.map(task => new Date(task.plannedEndDate))));
  const totalDays = (endDate - startDate) / (1000 * 60 * 60 * 24);

  const handleDragStart = (e, taskId, type, handleType) => {
    const ganttRect = ganttRef.current.getBoundingClientRect();
    e.dataTransfer.setData('sourceTaskId', taskId);
    e.dataTransfer.setData('type', type);
    e.dataTransfer.setData('handleType', handleType);
    let relatedTasks = [];
    if (shiftPressed && type === 'bar') {
      relatedTasks = findRelatedTasks(taskId, tasks);
    }
    setDraggingTask({ 
      taskId, 
      type, 
      handleType, 
      initialX: e.clientX - ganttRect.left, 
      initialY: e.clientY - ganttRect.top,
      relatedTasks,
      lastX: e.clientX
    });
    if (handleType === 'dependency') {
      setActiveDependency({ taskId, type });
    }
    e.dataTransfer.setDragImage(new Image(), 0, 0); // Evita o ícone de arrasto padrão
  };

  const handleDrag = (e) => {
    if (!draggingTask || e.clientX === 0) return;

    const { taskId, type, initialX, initialY, handleType, relatedTasks, lastX } = draggingTask;
    const ganttRect = ganttRef.current.getBoundingClientRect();

    if (handleType === 'dependency') {
      setLinePosition({ 
        startX: initialX + scrollPosition.scrollX, 
        startY: initialY -27 + scrollPosition.scrollY, 
        endX: e.clientX - ganttRect.left + scrollPosition.scrollX, 
        endY: e.clientY - ganttRect.top-27 + scrollPosition.scrollY
      });
      return;
    }

    const deltaX = e.clientX - lastX;
    const dayOffset = deltaX / 70; 
    const roundedDayOffset = Math.round(dayOffset);

    if (Math.abs(roundedDayOffset) >= 1) {
      const updatedTasks = tasks.map(task => {
        if (shiftPressed && relatedTasks.length > 0 && relatedTasks.some(rt => rt.id === task.id)) {
          return moveTask(task, roundedDayOffset);
        } else if (task.id === taskId) {
          if (type === 'bar') {
            return validateTaskUpdate(task, moveTask(task, roundedDayOffset));
          } else if (type === 'start') {
            const updatedTask = moveTask(task, roundedDayOffset);
            updatedTask.plannedEndDate = task.plannedEndDate;
            return validateTaskUpdate(task, updatedTask, true);
          } else if (type === 'end') {
            const updatedTask = moveTask(task, roundedDayOffset);
            updatedTask.plannedStartDate = task.plannedStartDate;
            return validateTaskUpdate(task, updatedTask, true);
          }
        }
        return task;
      });

      setTasks(updatedTasks);
      setDraggingTask({ ...draggingTask, lastX: e.clientX });
    }
  };

  const moveTask = (task, dayOffset) => {
    const taskStartDate = new Date(task.plannedStartDate);
    const taskEndDate = new Date(task.plannedEndDate);
    const newStartDate = new Date(taskStartDate.getTime() + dayOffset * (1000 * 60 * 60 * 24));
    const newEndDate = new Date(taskEndDate.getTime() + dayOffset * (1000 * 60 * 60 * 24));
    return {
      ...task,
      plannedStartDate: newStartDate.toISOString().split('T')[0],
      plannedEndDate: newEndDate.toISOString().split('T')[0],
    };
  };

  const validateTaskUpdate = (task, updatedTask, isDraggingHandle = false) => {
    const newStartDate = new Date(updatedTask.plannedStartDate);
    const newEndDate = new Date(updatedTask.plannedEndDate);
    const prerequisites = task.prerequisites.map(depId => tasks.find(t => t.id === depId));
    const isValidStartDate = prerequisites.every(dep => newStartDate >= new Date(dep.plannedEndDate));
    const dependentTasks = tasks.filter(t => t.prerequisites.includes(task.id));
    const isValidEndDate = dependentTasks.every(dep => newEndDate <= new Date(dep.plannedStartDate));
    const isValidDuration = newEndDate > newStartDate;

    if (isDraggingHandle && !isValidDuration) {
      return task; 
    }

    if (isValidStartDate && isValidEndDate && isValidDuration) {
      return updatedTask;
    }
    return task;
  };

  const handleDrop = async (e) => {
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
            await addPreresquisiteTaskById(sourceTaskId, targetTaskId);
          } else if (sourceStartDate >= targetEndDate) {
            setTasks(tasks.map(task => {
              if (task.id === sourceTaskId) {
                const prerequisites = [...task.prerequisites, targetTaskId];
                return { ...task, prerequisites };
              }
              return task;
            }));
            console.log("targetTaskId", targetTaskId);
            await addPreresquisiteTaskById(targetTaskId, sourceTaskId);
          }
        }
      }
    } else if (shiftPressed && draggingTask && draggingTask.relatedTasks.length > 0) {
      try {
        for (const task of draggingTask.relatedTasks) {
          await updateTaskById(task.id);
        }
      } catch (error) {
        console.error("Error updating tasks:", error);
      }
    } else {
      try {
        console.log("sourceTaskId", sourceTaskId);
        await updateTaskById(sourceTaskId);
      } catch (error) {
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

  const handleTaskDoubleClick = (taskId) => {
    handleEditTaskClick(taskId);
  };



  

  const circleDragEnter = () => {
    setCircleDragHoovered(true);
  };

  const circleDragLeave = () => {
    setCircleDragHoovered(false);
  };

  const findRelatedTasks = (taskId, allTasks) => {
    let relatedTasks = new Set();
    let tasksToCheck = [taskId];

    while (tasksToCheck.length > 0) {
      const currentTaskId = tasksToCheck.pop();
      if (!relatedTasks.has(currentTaskId)) {
        relatedTasks.add(currentTaskId);
        const currentTask = allTasks.find(t => t.id === currentTaskId);

        if (currentTask) {
          // Adicionar todas as tarefas dependentes
          currentTask.prerequisites.forEach(depId => tasksToCheck.push(depId));
          // Adicionar todas as tarefas que dependem desta tarefa
          allTasks.filter(t => t.prerequisites.includes(currentTaskId)).forEach(t => tasksToCheck.push(t.id));
        }
      }
    }

    return Array.from(relatedTasks).map(id => allTasks.find(t => t.id === id));
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

  const generateMonths = (timeline) => {
    const months = [];
    let currentMonth = null;
    let daysInMonth = 0;
  
    timeline.forEach((date, index) => {
      const month = date.getMonth();
      if (currentMonth === null || currentMonth !== month) {
        if (currentMonth !== null) {
          months.push({ month: currentMonth + 1, days: daysInMonth });
        }
        currentMonth = month;
        daysInMonth = 1;
      } else {
        daysInMonth += 1;
      }
    });
  
    if (currentMonth !== null) {
      months.push({ month: currentMonth + 1, days: daysInMonth });
    }
  
    return months;
  };
  

  const generateYears = (timeline) => {
    const years = [];
    let currentYear = null;
    let daysInYear = 0;
  
    timeline.forEach((date) => {
      const year = date.getFullYear();
      if (currentYear === null || currentYear !== year) {
        if (currentYear !== null) {
          years.push({ year: currentYear, days: daysInYear });
        }
        currentYear = year;
        daysInYear = 1;
      } else {
        daysInYear += 1;
      }
    });
  
    if (currentYear !== null) {
      years.push({ year: currentYear, days: daysInYear });
    }
  
    return years;
  };
  

  const isWeekend = (date) => {
    const day = date.getDay();
    return day === 0 || day === 6;
  };

  const timeline = generateTimeline();
  const months = generateMonths(timeline);
  const years = generateYears(timeline);

  return (
    <div className={styles.mainGanttContainer}>
      <div className={styles.ganttContainer} ref={ganttRef} onDrop={handleDrop} onDragOver={(e) => e.preventDefault()}>
  
         {/* <div className={styles.timeline}>
            {years.map(({ year, days }) => (
              <div key={year} className={styles.year} style={{ width: `${days * 50}px`, overflow:`hidden` }}>
                {year}
              </div>
            ))}
          </div>
          <div className={styles.timeline}>
            {months.map(({ month, days }) => (
                <div key={month} className={styles.month} style={{ width: `${days * 50}px`, overflow:`hidden` }}>
                  {month}
                </div>
              ))}
          </div> */}
          <div className={styles.timeline}>
          {timeline.map((date, index) => (
            <div key={index} className={`${styles.timelineDate} ${isWeekend(date) ? styles.isWeekend : ''}`}>
              {date.toISOString().split('T')[0].slice(5)} {/* Remove o ano */}
            </div>
          ))}
        </div>
  
        <div className={styles.taskBars}>
          {tasks.map((task, index) => {
            const taskStartDate = new Date(task.plannedStartDate);
            const taskEndDate = new Date(task.plannedEndDate);
            const taskStartOffset = ((taskStartDate - new Date(timeline[0])) / (1000 * 60 * 60 * 24)) * 50; // Cada dia tem 50px de largura
            const taskDuration = ((taskEndDate - taskStartDate) / (1000 * 60 * 60 * 24)) * 50; // Cada dia tem 40px de largura

            return (
              <div>
                <div
                  onDoubleClick={() => handleTaskDoubleClick(task.id)}
                  key={task.id}
                  className={styles.taskBar}
                  data-task-id={task.id}
                  style={{
                    left: `${taskStartOffset}px`,
                    width: `${taskDuration}px`,
                    top: `${index * 40}px`
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
                    style={{ backgroundImage: barTaskColors[task.state] }}
                  >
                 
                  </div>
                  <div className={styles.taskHandleEnd}
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
                
                  <div 
                    key={task.id}
                    className={styles.taskInfo}
                    data-task-id={task.id}
                    style={{
                      left: `${taskStartOffset + taskDuration + 15}px`,
                      width: `${taskDuration}px`,
                      top: `${index * 40}px`
                    }}
                    >
                  {(dimensions.width < 1250 || isTouch) && (
                    <div className={styles.taskTitle}>{task.title}</div>
                  )}
                    <div className={styles.responsiblePhotoDiv}>
                      <img src={task.responsible.photo} alt="" className={styles.responsiblePhoto}/>
                    </div>
                    
                  </div>               
                          
              </div>
              
            );
          })}
          {linePosition && (
            <div
              className={styles.temporaryDependencyLine}
              style={{
                left: `${linePosition.startX}px`,
                top: `${linePosition.startY}px`,
                width: `${Math.sqrt(Math.pow(linePosition.endX - linePosition.startX, 2) + Math.pow(linePosition.endY - linePosition.startY, 2))}px`,
                transform: `rotate(${Math.atan2(linePosition.endY - linePosition.startY, linePosition.endX - linePosition.startX)}rad)`,
                transformOrigin: '0 0'
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

              const depEndOffset = ((depEndDate - new Date(timeline[0])) / (1000 * 60 * 60 * 24)) * 50;
              const taskStartOffset = ((taskStartDate - new Date(timeline[0])) / (1000 * 60 * 60 * 24)) * 50;

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
                      stroke="var(--dependency-line-color)"
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
                      stroke="var(--dependency-line-color)"
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
