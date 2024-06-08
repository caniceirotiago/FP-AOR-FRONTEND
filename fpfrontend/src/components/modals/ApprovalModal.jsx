import React, { useState } from 'react';
import Button from '../buttons/landingPageBtn/Button.jsx';
import styles from './ApprovalModal.module.css';
import projectService from '../../services/projectService.jsx';

const ApprovalModal = ({ isOpen, onClose, title, projectId }) => {
  const [justification, setJustification] = useState('');


  const onRequestClose = () => {
    setJustification('');
    onClose();
  }
  const handleSubmit = async () => {
    try {
        let isToApprove = title === "Approve Project";
      await projectService.approveOrRejectProject(projectId, justification, isToApprove);
      console.log("Project approved or rejected successfully");
      onClose();
    } catch (error) {
      console.error("Failed to approve or reject project:", error);
    }
  }

  if(!isOpen) return null;

  return (
    <div
      isOpen={isOpen}
      className={styles.modal}
      overlayClassName={styles.overlay}
    >
      <h2>{title}</h2>
      <textarea
        className={styles.textarea}
        value={justification}
        onChange={(e) => setJustification(e.target.value)}
        placeholder="Enter justification..."
      />
      <div className={styles.buttons}>
        <Button  tradId="submit" className={styles.button} onClick={handleSubmit} defaultText="Submit" btnColor={"var(--btn-color2)"} />
        <Button tradId="cancel" className={styles.button} onClick={onRequestClose} defaultText="Cancel" btnColor={"var(--btn-color2)"} />
      </div>
    </div>
  );
};

export default ApprovalModal;
