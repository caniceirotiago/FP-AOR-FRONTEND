import React, { useRef, useState } from 'react';
import styles from './GanttChart.module.css';

const GanttChart = ({ tasks, setTasks }) => {
  const ganttRef = useRef(null);
  const [draggingTask, setDraggingTask] = useState(null);
  const startDate = new Date(Math.min(...tasks.map(task => new Date(task.start))));
  const endDate = new Date(Math.max(...tasks.map(task => new Date(task.end))));
  const totalDays = (endDate - startDate) / (1000 * 60 * 60 * 24);

  const handleDragStart = (e, taskId, type) => {
    e.dataTransfer.setData('taskId', taskId);
    e.dataTransfer.setData('type', type);
    setDraggingTask({ taskId, type, initialX: e.clientX });
    e.dataTransfer.setDragImage(new Image(), 0, 0); // Evita o ícone de arrasto padrão
  };

  const handleDrag = (e) => {
    if (!draggingTask || e.clientX === 0) return;

    const { taskId, type, initialX } = draggingTask;
    const ganttRect = ganttRef.current.getBoundingClientRect();
    const deltaX = e.clientX - initialX;
    const dayOffset = (deltaX / 40); // Cada dia tem 40px de largura
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
        setDraggingTask({ ...draggingTask, initialX: e.clientX });
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
        setDraggingTask({ ...draggingTask, initialX: e.clientX });
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
        setDraggingTask({ ...draggingTask, initialX: e.clientX });
      }
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDraggingTask(null);
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
              style={{
                left: `${taskStartOffset}px`,
                width: `${taskDuration}px`,
                top: `${index * 40}px` // Ajuste a altura da barra
              }}
            >
              <div
                className={styles.taskHandleStart}
                draggable
                onDragStart={(e) => handleDragStart(e, task.id, 'start')}
                onDrag={(e) => handleDrag(e, task.id, 'start')}
                onDragEnd={handleDrop}
              ></div>
              <div className={styles.taskContent}
                draggable
                onDragStart={(e) => handleDragStart(e, task.id, 'bar')}
                onDrag={(e) => handleDrag(e, task.id, 'bar')}
                onDragEnd={handleDrop}>
                {task.name}
              </div>
              <div
                className={styles.taskHandleEnd}
                draggable
                onDragStart={(e) => handleDragStart(e, task.id, 'end')}
                onDrag={(e) => handleDrag(e, task.id, 'end')}
                onDragEnd={handleDrop}
              ></div>
            </div>
          );
        })}
      </div>
    </div>
    </div>
  );
};

export default GanttChart;
