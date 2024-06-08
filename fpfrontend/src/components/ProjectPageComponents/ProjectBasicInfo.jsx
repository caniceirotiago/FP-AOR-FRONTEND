import React, { useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";
import styles from "./ProjectBasicInfo.module.css";
import Button from '../buttons/landingPageBtn/Button.jsx'

const ProjectBasicInfo = ({ projectInfo, laboratories, setProjectInfo, isEditing, updateProjectInfo, onApprove, onReject, onCancel }) => {
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setProjectInfo((prevInfo) => ({
      ...prevInfo,
      [name]: value,
    }));
  };

  const handleUpdateProject = async () => {
    await updateProjectInfo();
  };

  const handleStateChange = async (newState) => {
    setProjectInfo((prevInfo) => ({
      ...prevInfo,
      state: newState,
    }));
  };

  useEffect(() => {
    if (projectInfo.state) {
      updateProjectInfo();
    }
  }, [projectInfo.state]);

  const renderStateActions = () => {
    switch (projectInfo.state) {
      case "PLANNING":
        return (
          <>
            <button
              className={styles.smallButton}
              onClick={() => handleStateChange("READY")}
            >
              Mark as Ready
            </button>
            <button
              className={`${styles.smallButton} ${styles.cancelBtn}`}
              onClick={() => handleStateChange("CANCELLED")}
            >
              Cancel Project
            </button>
          </>
        );
      case "READY":
        return (
          <>
            <button
              className={styles.smallButton}
              onClick={() => handleStateChange("PLANNING")}
            >
              Mark as Planning
            </button>
            <button
              className={`${styles.smallButton} ${styles.cancelBtn}`}
              onClick={() => handleStateChange("CANCELLED")}
            >
              Cancel Project
            </button>
          </>
        );
      case "IN_PROGRESS":
        return (
          <>
            <button
              className={styles.smallButton}
              onClick={() => handleStateChange("FINISHED")}
            >
              Mark as Finished
            </button>
            <button
              className={`${styles.smallButton} ${styles.cancelBtn}`}
              onClick={() => handleStateChange("CANCELLED")}
            >
              Cancel Project
            </button>
          </>
        );
      default:
        return null;
    }
  };

  if (!projectInfo) {
    return null; 
  }

  return (
    <div className={styles.projectContainer}>
      <div className={styles.statusContainer}>
        <label className={styles.label}>Project Status</label>
        <div className={styles.statusDisplay}>
          <span
            className={styles.statusIndicator}
            style={{ backgroundColor: getStatusColor(projectInfo.state) }}
          ></span>
          <span>{projectInfo.state}</span>
          <div className={styles.stateActions}>
            {isEditing && renderStateActions()}
          </div>
        </div>
      </div>
      <div className={styles.formContainer}>
        <form className={styles.form}>
          <label className={styles.label}>Project Name</label>
          <input
            className={styles.input}
            type="text"
            name="name"
            value={projectInfo.name}
            onChange={handleInputChange}
            disabled={!isEditing}
          />
          <label className={styles.label}>Description</label>
          <textarea
              className={styles.textarea}
              name="description"
              value={projectInfo.description}
              onChange={handleInputChange}
              disabled={!isEditing}
            />
          <label className={styles.label}>Motivation</label>
          <textarea
              className={styles.textarea}
              name="motivation"
              value={projectInfo.motivation}
              onChange={handleInputChange}
              disabled={!isEditing}
            />

          <label className={styles.label}>Laboratory</label>
          <FormattedMessage id="laboratoryPlaceholder" defaultMessage="Select your laboratory">
            {(placeholder) => (
              <select
                className={styles.select}
                name="laboratoryId"
                id="laboratoryId-field"
                value={projectInfo?.laboratory.id || ''}
                onChange={handleInputChange}
                disabled={!isEditing}
              >
                <option value="">{placeholder}</option>
                {laboratories.map((lab) => (
                  <option key={lab.id} value={lab.id}>
                    {lab.location}
                  </option>
                ))}
              </select>
            )}
          </FormattedMessage>
          <label className={styles.label}>Conclusion Date</label>
          <input
            type="date"
            className={styles.datePicker}
            name="conclusionDate"
            value={projectInfo.conclusionDate ? new Date(projectInfo.conclusionDate).toISOString().substring(0, 10) : ''}
            onChange={handleInputChange}
            disabled={!isEditing}
          />
          {isEditing && (
            <div className={styles.buttonContainer}>
            <Button
              className={styles.button}
              onClick={handleUpdateProject}
              tradId="saveFields"
              defaultText="Save Fields"
              btnColor={"var(--btn-color2)"}
            />
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default ProjectBasicInfo;

const getStatusColor = (status) => {
  switch (status) {
    case "PLANNING":
      return "var(--color-planning)";
    case "READY":
      return "var(--color-ready)";
    case "IN_PROGRESS":
      return "var(--color-in-progress)";
    case "FINISHED":
      return "var(--color-finished)";
    case "CANCELLED":
      return "var(--color-cancelled)";
    default:
      return "var(--color-default)";
  }
};
