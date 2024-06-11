import React, { useRef, useState } from 'react';
import styles from './GanttChart.module.css';

const GanttChart = ({ tasks, setTasks }) => {
  const ganttRef = useRef(null);
  const [draggingTask, setDraggingTask] = useState(null);
  const [activeDependency, setActiveDependency] = useState(null);
  const [linePosition, setLinePosition] = useState(null);

  const startDate = new Date(Math.min(...tasks.map(task => new Date(task.start))));
  const endDate = new Date(Math.max(...tasks.map(task => new Date(task.end))));
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
      if (type === 'bar') {
        setTasks(tasks.map(task => {
          if (task.id === taskId) {
            const taskStartDate = new Date(task.start);
            const taskEndDate = new Date(task.end);
            const newStartDate = new Date(taskStartDate.getTime() + roundedDayOffset * (1000 * 60 * 60 * 24));
            const newEndDate = new Date(taskEndDate.getTime() + roundedDayOffset * (1000 * 60 * 60 * 24));
            return {
              ...task,
              start: newStartDate.toISOString().split('T')[0],
              end: newEndDate.toISOString().split('T')[0]
            };
          }
          return task;
        }));
        setDraggingTask({ ...draggingTask, initialX: e.clientX - ganttRect.left });
      } else if (type === 'start') {
        setTasks(tasks.map(task => {
          if (task.id === taskId) {
            const taskEndDate = new Date(task.end);
            const newStartDate = new Date(new Date(task.start).getTime() + roundedDayOffset * (1000 * 60 * 60 * 24));
            if (newStartDate > taskEndDate) return task; // Evita a inversão das datas
            return { ...task, start: newStartDate.toISOString().split('T')[0] };
          }
          return task;
        }));
        setDraggingTask({ ...draggingTask, initialX: e.clientX - ganttRect.left });
      } else if (type === 'end') {
        setTasks(tasks.map(task => {
          if (task.id === taskId) {
            const taskStartDate = new Date(task.start);
            const newEndDate = new Date(new Date(task.end).getTime() + roundedDayOffset * (1000 * 60 * 60 * 24));
            if (newEndDate < taskStartDate) return task; // Evita a inversão das datas
            return { ...task, end: newEndDate.toISOString().split('T')[0] };
          }
          return task;
        }));
        setDraggingTask({ ...draggingTask, initialX: e.clientX - ganttRect.left });
      }
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const sourceTaskId = Number(e.dataTransfer.getData('sourceTaskId'));
    const handleType = e.dataTransfer.getData('handleType');
    const targetTaskId = Number(e.target.dataset.taskId);

    if (activeDependency && handleType === 'dependency') {
      if (sourceTaskId !== targetTaskId) {
        const sourceTask = tasks.find(task => task.id === sourceTaskId);
        const targetTask = tasks.find(task => task.id === targetTaskId);

        if (sourceTask && targetTask) {
          const sourceStartDate = new Date(sourceTask.start);
          const targetStartDate = new Date(targetTask.start);

          if (sourceStartDate < targetStartDate) {
            // Source task is independent, target task is dependent
            setTasks(tasks.map(task => {
              if (task.id === targetTaskId) {
                const dependencies = [...task.dependencies, sourceTaskId];
                return { ...task, dependencies };
              }
              return task;
            }));
          } else {
            // Target task is independent, source task is dependent
            setTasks(tasks.map(task => {
              if (task.id === sourceTaskId) {
                const dependencies = [...task.dependencies, targetTaskId];
                return { ...task, dependencies };
              }
              return task;
            }));
          }
        }
      }
    }

    setDraggingTask(null);
    setActiveDependency(null);
    setLinePosition(null);
  };

  const handleDependencyDoubleClick = (taskId, depId) => {
    setTasks(tasks.map(task => {
      if (task.id === taskId) {
        const updatedDependencies = task.dependencies.filter(dependency => dependency !== depId);
        return { ...task, dependencies: updatedDependencies };
      }
      return task;
    }));
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
            const taskStartDate = new Date(task.start);
            const taskEndDate = new Date(task.end);
            const taskStartOffset = ((taskStartDate - startDate) / (1000 * 60 * 60 * 24)) * 50; // Cada dia tem 40px de largura
            const taskDuration = ((taskEndDate - taskStartDate) / (1000 * 60 * 60 * 24)) * 50; // Cada dia tem 40px de largura

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
                  {task.name}
                </div>
                <div
                  className={styles.taskHandleEnd}
                  draggable
                  onDragStart={(e) => handleDragStart(e, task.id, 'end', 'handle')}
                  onDrag={(e) => handleDrag(e, task.id, 'end')}
                  onDragEnd={handleDrop}
                ></div>
                <div
                  className={styles.taskCircleStart}
                  draggable
                  data-task-id={task.id}
                  onDragStart={(e) => handleDragStart(e, task.id, 'start', 'dependency')}
                  onDrag={(e) => handleDrag(e, task.id, 'start')}
                  onDragEnd={handleDrop}
                ></div>
                <div
                  className={styles.taskCircleEnd}
                  draggable
                  data-task-id={task.id}
                  onDragStart={(e) => handleDragStart(e, task.id, 'end', 'dependency')}
                  onDrag={(e) => handleDrag(e, task.id, 'end')}
                  onDragEnd={handleDrop}
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
          {/* Renderizar linhas de dependência fixas */}
          <div className={styles.svgContainer}>
            {tasks.map((task) =>
              task.dependencies.map((depId) => {
                const depTask = tasks.find((t) => t.id === depId);
                if (!depTask) return null;

                const depEndDate = new Date(depTask.end);
                const taskStartDate = new Date(task.start);

                const depEndOffset = ((depEndDate - startDate) / (1000 * 60 * 60 * 24)) * 50;
                const taskStartOffset = ((taskStartDate - startDate) / (1000 * 60 * 60 * 24)) * 50;
                const depIndex = tasks.findIndex((t) => t.id === depId);
                const taskIndex = tasks.findIndex((t) => t.id === task.id);

                return (
                  <svg
                    key={`${task.id}-${depId}`}
                    className={styles.fixedDependencyLine}
                    style={{
                      position: 'absolute',
                      left: `${depEndOffset - 20}px`,
                      top: `${depIndex * 40 + 15}px`,
                      width: `${taskStartOffset - depEndOffset + 20}px`,
                      height: `${Math.abs((taskIndex - depIndex) * 40)}px`,
                    }}
                  >
                    <path
                      className={styles.fixedLine}
                      d={`
                        M 0 0 
                        L 0 ${(taskIndex - depIndex) * 40 - 20}
                        Q 0 ${(taskIndex - depIndex) * 40} 20 ${(taskIndex - depIndex) * 40}
                        L ${taskStartOffset - depEndOffset + 20} ${(taskIndex - depIndex) * 40}
                      `}
                      fill="none"
                      stroke="red"
                      strokeWidth="2"
                      onDoubleClick={() => handleDependencyDoubleClick(task.id, depId)} // Adiciona o manipulador de duplo clique

                    />
                  </svg>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GanttChart;
