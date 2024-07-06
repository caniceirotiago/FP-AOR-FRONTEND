import React, { useEffect } from "react";
import styles from "./LogsList.module.css";
import { format, parseISO } from "date-fns";
import { useCallback } from "react";
import projectService from "../../../services/projectService";
import { useState } from "react";

const LogsList = ({ id }) => {
  const [projectLogs, setProjectLogs] = useState([]);

  const formatDate = (dateString) => {
    const date = parseISO(dateString);
    return format(date, "dd/MM/yyyy HH:mm:ss");
  };

  const fetchProjectLogs = useCallback(async () => {
    try {
      const response = await projectService.getProjectLogsByProjectId(id);
      const logs = await response.json();
      setProjectLogs(logs);
    } catch (error) {
      console.error("Error fetching project logs:", error.message);
    }
  }, [id]);

  useEffect(() => {
    fetchProjectLogs();
  }, []);

  return (
    <div className={styles.container}>
      <h3>Project Logs</h3>
      <div className={styles.innerContainer}>
        <div className={styles.existingAttributes}>
          <div className={styles.userAttributeContainer}>
            <table className={styles.attributeTable}>
              <tbody>
                {projectLogs
                  .slice()
                  .reverse()
                  .map((log, index) => (
                    <tr className={styles.logElement} key={index}>
                      <td>{log.username}</td>
                      <td>{formatDate(log.creationDate)}</td>
                      <td>{log.content}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
export default LogsList;
