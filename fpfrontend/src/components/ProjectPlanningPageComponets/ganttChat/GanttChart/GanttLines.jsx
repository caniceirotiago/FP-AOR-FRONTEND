import React from "react";
import styles from "./GanttLines.module.css";

const isWeekend = (date) => {
  const day = date.getDay();
  return day === 0 || day === 6;
};
const isToday = (date) => {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
};

const GanttLines = ({ timeline, tasks }) => {
  const totalWidth = timeline.length * 50; 
  const totalHeight = tasks.length * 40 + 45; 

  return (
    <svg
      className={styles.svgContainer}
      width={totalWidth}
      height={totalHeight}
    >
      {timeline.map((date, index) => (
        <React.Fragment key={`v-${index}`}>
          {(isWeekend(date) || isToday(date)) && (
            <rect
              x={index * 50}
              y={0}
              width={50}
              height={totalHeight}
              fill={isToday(date) ? "var(--today-color)" : "var(--weekend-color)"}
            />
          )}
          <line
            x1={index * 50}
            y1={0}
            x2={index * 50}
            y2={totalHeight}
            stroke="var(--gantt-graphic-line-color)"
            strokeWidth="1"
          />
        </React.Fragment>
      ))}
      {tasks.map((task, index) => (
        <line
          key={`h-${index}`}
          x1={0}
          y1={index * 40 + 62}
          x2={totalWidth}
          y2={index * 40 + 62}
          stroke="var(--gantt-graphic-line-color)"
          strokeWidth="1"
        />
      ))}
    </svg>
  );
};

export default GanttLines;
