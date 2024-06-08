import React, { useState } from 'react';
import Modal from 'react-modal';
import Button from '../buttons/landingPageBtn/Button.jsx';
import styles from './ApprovalModal.module.css';

const ApprovalModal = ({ isOpen, onRequestClose, onSubmit, title, message }) => {
  const [justification, setJustification] = useState('');

  const handleSubmit = () => {
    onSubmit(justification);
    onRequestClose();
  }

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className={styles.modal}
      overlayClassName={styles.overlay}
    >
      <h2>{title}</h2>
      <p>{message}</p>
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
    </Modal>
  );
};

export default ApprovalModal;
