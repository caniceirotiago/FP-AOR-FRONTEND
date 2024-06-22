import React, { useState } from "react";
import styles from "./CreateProjectModal.module.css";
import { FormattedMessage, useIntl } from "react-intl";
import AttributeEditor from "../reactSelect/AttributeEditor.jsx";
import { format } from "date-fns";
import "react-datepicker/dist/react-datepicker.css";
import useDialogModalStore from "../../stores/useDialogModalStore.jsx";
import taskService from "../../services/taskService";

const CreateTaskModal = ({ isOpen, onClose, projectId, onTaskCreated }) => {
  const { setDialogMessage, setIsDialogOpen, setAlertType, setOnConfirm } =
    useDialogModalStore();
  const intl = useIntl();
  const [taskData, setTaskData] = useState({
    title: "",
    description: "",
    plannedStartDate: "",
    plannedEndDate: "",
    responsibleId: "",
  });

  const handleChange = (e) => {
    setTaskData({ ...taskData, [e.target.name]: e.target.value });
  };

  const handleDescriptionChange = (e) => {
    setTaskData((prevData) => ({ ...prevData, description: e.target.value }));
  };

  const handleDateChange = (date, dateType) => {
    const formattedDate = format(date, "yyyy-MM-dd'T'00:00:00'Z'");
    setTaskData((prevData) => ({ ...prevData, [dateType]: formattedDate }));
  };

  const onAddingResponsibleChange = (newResponsible) => {
    const responsibleId = newResponsible[0]?.user?.id;
    console.log(responsibleId);
    setTaskData((prevData) => ({ ...prevData, responsibleId: responsibleId }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const dataToSend = {
      title: taskData.title,
      description: taskData.description,
      plannedStartDate: taskData.plannedStartDate,
      plannedEndDate: taskData.plannedEndDate,
      responsibleId: taskData.responsibleId,
      projectId: projectId,
    };
    console.log(dataToSend);
    const response = await taskService.createTask(dataToSend, projectId);
    if (response.status === 204) {
      setDialogMessage(
        intl.formatMessage({
          id: "taskCreatedSuccess",
          defaultMessage: "Task created successfully!",
        })
      );
      setAlertType(true);
      setIsDialogOpen(true);
      setOnConfirm(() => {
        onTaskCreated();
        onClose();
        setIsDialogOpen(false);
      });
    } else {
      const data = await response.json();
      setDialogMessage(data.errorMessage);
      setAlertType(true);
      setIsDialogOpen(true);
      setOnConfirm(() => {});
    }
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
              <FormattedMessage id="taskTitle" defaultMessage="Task Title" />
            </label>
            <input
              className={styles.input}
              type="text"
              name="title"
              value={taskData.title}
              onChange={handleChange}
            />
            <label className={styles.label}>
              <FormattedMessage id="description" defaultMessage="Description" />
            </label>
            <textarea
              className={styles.textarea}
              name="description"
              value={taskData.description}
              onChange={handleDescriptionChange}
            />
            <label className={styles.label}>
              <FormattedMessage
                id="initialPlannedDate"
                defaultMessage="Initial Planned Date"
              />
            </label>
            <input
              type="date"
              className={styles.datePicker}
              value={
                taskData.plannedStartDate
                  ? new Date(taskData.plannedStartDate)
                      .toISOString()
                      .substring(0, 10)
                  : ""
              }
              onChange={(e) =>
                handleDateChange(new Date(e.target.value), "plannedStartDate")
              }
            />
            <label className={styles.label}>
              <FormattedMessage
                id="finalPlannedDate"
                defaultMessage="Final Planned Date"
              />
            </label>
            <input
              type="date"
              className={styles.datePicker}
              value={
                taskData.plannedEndDate
                  ? new Date(taskData.plannedEndDate)
                      .toISOString()
                      .substring(0, 10)
                  : ""
              }
              onChange={(e) =>
                handleDateChange(new Date(e.target.value), "plannedEndDate")
              }
            />

            <div className={styles.attributeEditor}>
              <AttributeEditor
                onAttributesChange={onAddingResponsibleChange}
                title="users"
                editMode={true}
                mainEntity={"task"}
                creationMode={true}
                projectId={projectId}
              />
            </div>
            <button type="submit" className={styles.button}>
              <FormattedMessage id="submit" defaultMessage="Submit" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateTaskModal;
