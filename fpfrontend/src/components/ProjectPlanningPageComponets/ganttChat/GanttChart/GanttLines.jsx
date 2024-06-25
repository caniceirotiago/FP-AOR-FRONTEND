import React from "react";
import styles from "./GanttLines.module.css";

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
        <line
          key={`v-${index}`}
          x1={index * 50}
          y1={0}
          x2={index * 50}
          y2={totalHeight}
          stroke="var(--gantt-graphic-line-color)"
          strokeWidth="1"
        />
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
