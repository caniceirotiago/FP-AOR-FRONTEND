import React, { useEffect } from "react";
import { FormattedMessage } from "react-intl";
import styles from "./ProjectBasicInfo.module.css";
import useDialogModalStore from "../../stores/useDialogModalStore.jsx";
import { FaSave } from "react-icons/fa";
import { PROJECT_STATES } from "../../utils/constants/constants";
import { format } from 'date-fns';

const ProjectBasicInfo = ({
  projectInfo,
  laboratories,
  setProjectInfo,
  isEditing,
  updateProjectInfo,
}) => {
  const { setDialogMessage, setIsDialogOpen, setAlertType, setOnConfirm } =
    useDialogModalStore();

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
    if (
      newState === PROJECT_STATES.CANCELLED ||
      newState === PROJECT_STATES.FINISHED
    ) {
      let message = "";
      if (newState === PROJECT_STATES.CANCELLED) {
        message = (
          <FormattedMessage
            id="cancelProjectConfirmation"
            defaultMessage="Are you sure you want to cancel this project?"
          />
        );
      }
      if (newState === PROJECT_STATES.FINISHED) {
        message = (
          <FormattedMessage
            id="finishProjectConfirmation"
            defaultMessage="Are you sure you want to finish this project?"
          />
        );
      }
      setDialogMessage(message);
      setAlertType(false);
      setIsDialogOpen(true);
      setOnConfirm(async () => {
        setProjectInfo((prevInfo) => ({
          ...prevInfo,
          state: newState,
        }));
      });
    } else {
      setProjectInfo((prevInfo) => ({
        ...prevInfo,
        state: newState,
      }));
    }
  };

  useEffect(() => {
    if (projectInfo.state) {
      updateProjectInfo();
    }
  }, [projectInfo.state]);

  const renderStateActions = () => {
    switch (projectInfo.state) {
      case PROJECT_STATES.PLANNING:
        return (
          <>
            <button
              className={`${styles.smallButton} ${styles.cancelBtn}`}
              onClick={() => handleStateChange(PROJECT_STATES.CANCELLED)}
            >
              <FormattedMessage
                id="cancelProject"
                defaultMessage="Cancel Project"
              />
            </button>
            <button
              className={styles.smallButton}
              onClick={() => handleStateChange(PROJECT_STATES.READY)}
            >
              <FormattedMessage
                id="markAsReady"
                defaultMessage="Mark as Ready"
              />
            </button>
          </>
        );
      case PROJECT_STATES.READY:
        return (
          <>
            <button
              className={`${styles.smallButton} ${styles.cancelBtn}`}
              onClick={() => handleStateChange(PROJECT_STATES.CANCELLED)}
            >
              <FormattedMessage
                id="cancelProject"
                defaultMessage="Cancel Project"
              />
            </button>
            <button
              className={styles.smallButton}
              onClick={() => handleStateChange(PROJECT_STATES.PLANNING)}
            >
              <FormattedMessage
                id="markAsPlanning"
                defaultMessage="Mark as Planning"
              />
            </button>
          </>
        );
      case PROJECT_STATES.IN_PROGRESS:
        return (
          <>
            <button
              className={`${styles.smallButton} ${styles.cancelBtn}`}
              onClick={() => handleStateChange(PROJECT_STATES.CANCELLED)}
            >
              <FormattedMessage
                id="cancelProject"
                defaultMessage="Cancel Project"
              />
            </button>
            <button
              className={styles.smallButton}
              onClick={() => handleStateChange(PROJECT_STATES.FINISHED)}
            >
              <FormattedMessage
                id="markAsFinished"
                defaultMessage="Mark as Finished"
              />
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
        <label className={styles.label}>
          <FormattedMessage
            id="projectStatus"
            defaultMessage="Project Status"
          />
        </label>
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
          <div className={styles.FormSec1}>
            <label className={styles.label}>
              <FormattedMessage
                id="projectName"
                defaultMessage="Project Name"
              />
            </label>
            <input
              className={styles.input}
              type="text"
              name="name"
              value={projectInfo.name}
              onChange={handleInputChange}
              disabled={!isEditing}
            />
            <label className={styles.label}>
              <FormattedMessage id="laboratoryId" defaultMessage="Laboratory" />
            </label>
            <select
              className={styles.select}
              name="laboratoryId"
              id="laboratoryId-field"
              value={projectInfo?.laboratoryId || ""}
              onChange={handleInputChange}
              disabled={!isEditing}
            >
              <FormattedMessage
                id="laboratoryPlaceholder"
                defaultMessage="Select your laboratory"
              >
                {(placeholder) => (
                  <>
                    <option value="">{placeholder}</option>
                    {laboratories.map((lab) => (
                      <option key={lab.id} value={lab.id}>
                        {lab.locationName}
                      </option>
                    ))}
                  </>
                )}
              </FormattedMessage>
            </select>
            <label className={styles.label}>
              <FormattedMessage
                id="conclusionDate"
                defaultMessage="Conclusion Date"
              />
            </label>
            <input
              type="date"
              className={styles.datePicker}
              name="conclusionDate"
              value={
                projectInfo.conclusionDate
                  ? new Date(projectInfo.conclusionDate)
                      .toISOString()
                      .substring(0, 10)
                  : ""
              }
              onChange={handleInputChange}
              min={format(new Date(), "yyyy-MM-dd")}
              disabled={!isEditing}
            />
          </div>
          <div className={styles.FormSec2}>
            <label className={styles.label}>
              <FormattedMessage id="description" defaultMessage="Description" />
            </label>
            <textarea
              className={styles.textarea}
              name="description"
              value={projectInfo.description}
              onChange={handleInputChange}
              disabled={!isEditing}
            />
            <label className={styles.label}>
              <FormattedMessage id="motivation" defaultMessage="Motivation" />
            </label>
            <textarea
              className={styles.textarea}
              name="motivation"
              value={projectInfo.motivation}
              onChange={handleInputChange}
              disabled={!isEditing}
            />
          </div>
        </form>
        {isEditing && (
          <div className={styles.saveButtonContainer}>
            <button className={styles.saveButton} onClick={handleUpdateProject}>
              <FaSave className={styles.svgIcon} />
              <span className={styles.btnText}>
                <FormattedMessage id="save" defaultMessage="Save" />
              </span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectBasicInfo;

const getStatusColor = (status) => {
  switch (status) {
    case PROJECT_STATES.PLANNING:
      return "var(--color-planning)";
    case PROJECT_STATES.READY:
      return "var(--color-ready)";
    case PROJECT_STATES.IN_PROGRESS:
      return "var(--color-in-progress)";
    case PROJECT_STATES.FINISHED:
      return "var(--color-finished)";
    case PROJECT_STATES.CANCELLED:
      return "var(--color-cancelled)";
    default:
      return "var(--color-default)";
  }
};
