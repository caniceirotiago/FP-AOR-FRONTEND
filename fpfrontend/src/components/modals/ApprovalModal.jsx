import React, { useState } from "react";
import { useIntl, FormattedMessage } from "react-intl";
import Button from "../buttons/landingPageBtn/Button.jsx";
import styles from "./ApprovalModal.module.css";
import projectService from "../../services/projectService.jsx";
import useDialogModalStore from "../../stores/useDialogModalStore.jsx";

const ApprovalModal = ({
  isOpen,
  onClose,
  title,
  approveOrReject,
  projectId,
}) => {
  const [justification, setJustification] = useState("");
  const { setDialogMessage, setIsDialogOpen, setAlertType, setOnConfirm } =
    useDialogModalStore();
  const intl = useIntl();

  const onRequestClose = () => {
    setJustification("");
    onClose();
  };

  const handleSubmit = async () => {
    if (justification.trim() === "") {
      setDialogMessage(
        intl.formatMessage({
          id: "justificationRequired",
          defaultMessage: "Justification is required.",
        })
      );
      setIsDialogOpen(true);
      setAlertType(true);
      setOnConfirm(async () => {});
      return;
    }
    try {
      let isToApprove = approveOrReject;
      await projectService.approveOrRejectProject(
        projectId,
        justification,
        isToApprove
      );
      console.log("Project handled successfully");
      setJustification("");
      onClose();
    } catch (error) {
      console.log("Failed to process request.");
    }
  };

  if (!isOpen) return null;

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
        placeholder={intl.formatMessage({
          id: "enterJustification",
          defaultMessage: "Enter justification",
        })}
      />
      <div className={styles.buttons}>
        <Button
          tradId="submit"
          className={styles.button}
          onClick={handleSubmit}
          defaultText={<FormattedMessage id="submit" defaultMessage="Submit" />}
          btnColor={"var(--btn-color2)"}
        />
        <Button
          tradId="cancel"
          className={styles.button}
          onClick={onRequestClose}
          defaultText={<FormattedMessage id="cancel" defaultMessage="Cancel" />}
          btnColor={"var(--btn-color2)"}
        />
      </div>
    </div>
  );
};

export default ApprovalModal;
