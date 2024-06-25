import React, { useState } from "react";
import styles from "./Legend.module.css";
import useDeviceStore from "../../../../../stores/useDeviceStore.jsx";

const Legend = () => {
  const [showLegend, setShowLegend] = useState(false);
  const { isTouch } = useDeviceStore();

  const handleToggleLegend = () => {
    setShowLegend((prevShowLegend) => !prevShowLegend);
  };

  return (
    <div className={styles.legendContainer}>
      <div
        className={styles.infoIcon}
        onMouseEnter={() => !isTouch && setShowLegend(true)}
        onMouseLeave={() => !isTouch && setShowLegend(false)}
        onClick={isTouch ? handleToggleLegend : null}
      >
        i
      </div>
      {showLegend && (
        <div className={styles.legendContent}>
          <div className={styles.legendItem}>
            <span className={styles.legendColor} style={{ backgroundImage: "linear-gradient(45deg, var(--planned-task-color) 0%, var(--task-base-color) 100%)" }}></span>
            <span>Planned</span>
          </div>
          <div className={styles.legendItem}>
            <span className={styles.legendColor} style={{ backgroundImage: "linear-gradient(45deg, var(--in-progress-task-color) 0%, var(--task-base-color) 100%)" }}></span>
            <span>In Progress</span>
          </div>
          <div className={styles.legendItem}>
            <span className={styles.legendColor} style={{ backgroundImage: "linear-gradient(45deg, var(--finished-task-color) 0%, var(--task-base-color) 100%)" }}></span>
            <span>Finished</span>
          </div>
          {!isTouch ? <>
                <div className={styles.legendInstruction}>
                    <span><span className={styles.shiftIcon}>⇧ Shift</span> - drag multiple related tasks.</span>
                </div>
                <div className={styles.legendInstruction}>
                    <span>Double-click on dependencies to remove them.</span>
                </div>
          </>   : 
                <div className={styles.legendInstruction}>
                    <span>Use desktop version for full functionality.</span>
                </div>}
        </div>
          
      )}
    </div>
  );
};

export default Legend;
