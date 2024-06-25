import React, { useEffect, useRef} from 'react';
import styles from './TaskTable.module.css';
import { format } from 'date-fns';
import  useSyncScrollStore  from '../../../../stores/useSyncScrollStore.jsx';

const TaskTable = ({ tasks }) => {
  const tableRef = useRef(null);
  const { syncScrollPosition, setSyncScrollPosition } = useSyncScrollStore();

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return format(date, 'dd/MM/yyyy'); 
  };


  useEffect(() => {
    const tableElement = tableRef.current;
    if (tableElement) {
      tableElement.scrollLeft = syncScrollPosition.scrollX;
      tableElement.scrollTop = syncScrollPosition.scrollY;
    }
  }, [syncScrollPosition]);
  console.log(syncScrollPosition);
  return (
    <div className={styles.taskTable} ref={tableRef}>
      <table className={styles.table}>
        <thead className={styles.thead}>
          <tr className={styles.tr}>
            <th className={styles.th}>Name</th>
            <th className={styles.th}>Start Date</th>
            <th className={styles.th}>End Date</th>
          </tr>
        </thead>
        <tbody className={styles.body}>
          {tasks.map((task) => (
            <tr key={task.id} className={styles.tr}>
              <td className={styles.td}>{task.title}</td>
              <td className={styles.td}>{formatDate(task.plannedStartDate)}</td>
              <td className={styles.td}>{formatDate(task.plannedEndDate)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TaskTable;
