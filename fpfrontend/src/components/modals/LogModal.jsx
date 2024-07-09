import React, { useState } from "react";
import styles from "./CreateProjectModal.module.css";
import { FormattedMessage } from "react-intl";

const LogModal = ({ isOpen, onClose, onCreateLog }) => {
  const [logContent, setLogContent] = useState("");

  const handleChange = (e) => {
    setLogContent(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreateLog(logContent);
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <div className={styles.closeButton} onClick={onClose}>
          X
        </div>
        <div className={styles.formContainer}>
          <form className={styles.form} onSubmit={handleSubmit}>
            <label className={styles.label}>
              <FormattedMessage id="content" defaultMessage="Content" />
            </label>
            <textarea
              className={styles.textarea}
              name="content"
              value={logContent}
              onChange={handleChange}
              minLength={2}
              maxLength={180}
              required
            />
            <button type="submit" className={styles.button}>
              <FormattedMessage id="submit" defaultMessage="Submit" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LogModal;
