import React, { useEffect, useCallback, useState } from "react";
import styles from "./LogsList.module.css";
import { format, parseISO } from "date-fns";
import projectService from "../../../services/projectService";
import { FormattedMessage, useIntl } from "react-intl";
import { FaPlus } from "react-icons/fa";
import LogModal from "../../modals/LogModal";

const LogsList = ({ id }) => {
  const [projectLogs, setProjectLogs] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const intl = useIntl();

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

  /*
  useEffect(() => {
    fetchProjectLogs();
  }, [fetchProjectLogs]);
  */

  const handleOpenLogModal = () => {
    setShowModal(true);
  };

  const handleCloseLogModal = () => {
    setShowModal(false);
  };

  const handleCreateProjectLog = async (logContent) => {
    try {
      const dataToSend = {
        content: logContent,
      };
      console.log("Data to send:", dataToSend);
      console.log(dataToSend.content);
      const response = await projectService.createProjectLog(id, dataToSend);
      if (response.status === 204) {
        // Log created successfully, update project logs
        fetchProjectLogs();
        handleCloseLogModal();
      } else {
        const data = await response.json();
        console.log("Failed to create project log:", data.message);
      }
    } catch (error) {
      console.error("Error creating project log:", error.message);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.containerHeader}>
        <h3>
          <FormattedMessage id="projectLogs" defaultMessage="Project Logs" />
        </h3>
        <button
          onClick={handleOpenLogModal}
          className={`${styles.iconButton} ${styles.createButton}`}
          data-text={intl.formatMessage({ id: "addLog" })}
        >
          <FaPlus className={styles.svgIcon} />
        </button>
      </div>
      <div className={styles.innerContainer}>
        <div className={styles.existingAttributes}>
          <div className={styles.userAttributeContainer}>
            <table className={styles.attributeTable}>
              <thead>
                <tr>
                  <th className={styles.headerUser}>
                    <FormattedMessage id="user" defaultMessage="User" />
                  </th>
                  <th className={styles.headerDate}>
                    <FormattedMessage
                      id="creationDate"
                      defaultMessage="Creation Date"
                    />
                  </th>
                  <th className={styles.headerLogType}>
                    <FormattedMessage id="logType" defaultMessage="Log Type" />
                  </th>
                  <th className={styles.headerContent}>
                    <FormattedMessage id="content" defaultMessage="Content" />
                  </th>
                </tr>
              </thead>
              <tbody>
                {projectLogs
                  .slice()
                  .reverse()
                  .map((log, index) => (
                    <tr className={styles.logElement} key={index}>
                      <td className={styles.cellUser}>{log.username}</td>
                      <td className={styles.cellDate}>
                        {formatDate(log.creationDate)}
                      </td>
                      <td className={styles.cellLogType}>{log.type}</td>
                      <td className={styles.cellContent}>{log.content}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {showModal && (
        <LogModal
          isOpen={showModal}
          onClose={handleCloseLogModal}
          onCreateLog={handleCreateProjectLog}
        />
      )}
    </div>
  );
};
export default LogsList;
