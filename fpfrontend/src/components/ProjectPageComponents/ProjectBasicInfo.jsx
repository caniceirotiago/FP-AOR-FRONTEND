import React, { useEffect, useState, useMemo, useRef } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import styles from "./ProjectBasicInfo.module.css";
import Button from '../buttons/landingPageBtn/Button.jsx'
import useLabStore from "../../stores/useLabStore.jsx";
import useProjectStatesStore from "../../stores/useProjectStatesStore.jsx";

const ProjectBasicInfo = ({ projectInfo, laboratories, setProjectInfo, isEditing, updateProjectInfo, onApprove, onReject, onCancel }) => {
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setProjectInfo((prevInfo) => ({
      ...prevInfo,
      [name]: value,
    }));
  };

  const handleUpdateProject = () => {
    updateProjectInfo();
  }

  const renderStateActions = () => {
    switch (projectInfo.state) {
      case "PLANNING":
        return (
          <>
          <Button
            className={styles.button}
            onClick={() => setProjectInfo((prevInfo) => ({ ...prevInfo, state: "READY" }))}
            defaultText="Mark as Ready"
            btnColor={"var(--btn-color2)"}
            tradId="markAsReady"
          />
          <Button
              className={styles.button}
              onClick={() => setProjectInfo((prevInfo) => ({ ...prevInfo, state: "CANCELLED" }))}
              tradId="cancelProject"
              defaultText="Cancel Project"
              btnColor={"var(--btn-color2)"}
            />
          </>
        );
      case "READY":
        return (
          <>
          <Button
            className={styles.button}
            onClick={() => setProjectInfo((prevInfo) => ({ ...prevInfo, state: "PLANNING" }))}
            defaultText="Mark as PLANNING"
            btnColor={"var(--btn-color2)"}
            tradId="markAsPlanning"
          />
          <Button
              className={styles.button}
              onClick={() => setProjectInfo((prevInfo) => ({ ...prevInfo, state: "CANCELLED" }))}
              tradId="cancelProject"
              defaultText="Cancel Project"
              btnColor={"var(--btn-color2)"}
            />
          </>
        );
      case "IN_PROGRESS":
        return (
          <>
          <Button
            className={styles.button}
            onClick={() => setProjectInfo((prevInfo) => ({ ...prevInfo, state: "FINISHED" }))}
            defaultText="Mark as Finished"
            btnColor={"var(--btn-color2)"}
            tradId={"markAsFinished"}
          />
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
      <section className={styles.projectHeader}>
        <h1>{projectInfo.name}</h1>
      </section>
      <div className={styles.formContainer}>
        <form className={styles.form}>
        {isEditing && (<>
            <div className={styles.stateActions}>
              {renderStateActions()}
            </div>
          </>
          )}
          <label className={styles.label}>Project Status</label>
          <input
            className={styles.input}
            type="text"
            name="state"
            value={projectInfo.state}
            disabled
          />
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
          {isEditing ? (
            <textarea
              className={styles.textarea}
              name="description"
              value={projectInfo.description}
              onChange={handleInputChange}
            />
          ) : (
            <div className={styles.descriptionText}>
              <div dangerouslySetInnerHTML={{ __html: projectInfo.description }} />
            </div>
          )}

          <label className={styles.label}>Motivation</label>
          {isEditing ? (
            <textarea
              className={styles.textarea}
              name="motivation"
              value={projectInfo.motivation}
              onChange={handleInputChange}
            />
          ) : (
            <div className={styles.motivationText}>
              <div dangerouslySetInnerHTML={{ __html: projectInfo.motivation }} />
            </div>
          )}

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

          {isEditing && (<>

            <Button
              className={styles.button}
              onClick={handleUpdateProject}
              tradId="updateProject"
              defaultText="Update Project Basic Information"
              btnColor={"var(--btn-color2)"}
            />
            
          </>
          )}
          
        </form>
      </div>
    </div>
  );
};

export default ProjectBasicInfo;
