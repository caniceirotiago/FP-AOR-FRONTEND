import React, { useState, useEffect } from "react";
import styles from "./CreateTaskModal.module.css";
import { FormattedMessage, useIntl } from "react-intl";
import AttributeEditor from "../reactSelect/AttributeEditor.jsx";
import { format, isValid, addDays, set } from "date-fns";
import "react-datepicker/dist/react-datepicker.css";
import useDialogModalStore from "../../stores/useDialogModalStore.jsx";
import taskService from "../../services/taskService";

const CreateTaskModal = ({ isOpen, onClose, projectId, onTaskCreated }) => {
  const { setDialogMessage, setIsDialogOpen, setAlertType, setOnConfirm } = useDialogModalStore();
  const intl = useIntl();
  const today = new Date();

  const [taskData, setTaskData] = useState({
    title: "",
    description: "",
    plannedStartDate: format(today, "yyyy-MM-dd'T'00:00:00'Z'"),
    duration: 1,
    plannedEndDate: format(addDays(today, 1), "yyyy-MM-dd'T'00:00:00'Z'"),
    responsibleId: "",
  });

  useEffect(() => {
    const startDate = new Date(taskData.plannedStartDate);
    const endDate = addDays(startDate, taskData.duration);
    setTaskData((prevData) => ({
      ...prevData,
      plannedEndDate: format(endDate, "yyyy-MM-dd'T'00:00:00'Z'")
    }));
  }, [taskData.plannedStartDate, taskData.duration]);

  const handleChange = (e) => {
    setTaskData({ ...taskData, [e.target.name]: e.target.value });
  };

  const handleDescriptionChange = (e) => {
    setTaskData((prevData) => ({ ...prevData, description: e.target.value }));
  };

  const handleDateChange = (date, dateType) => {
    const formattedDate = isValid(date) ? format(date, "yyyy-MM-dd'T'00:00:00'Z'") : "";
    setTaskData((prevData) => ({ ...prevData, [dateType]: formattedDate }));
  };

  const handleDurationChange = (e) => {
    const duration = parseInt(e.target.value, 10);
    setTaskData((prevData) => ({ ...prevData, duration: duration }));
  };


  const onAddingResponsibleChange = (newResponsible) => {
    const responsibleId = newResponsible[0]?.user?.id;
    setTaskData((prevData) => ({ ...prevData, responsibleId: responsibleId }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(taskData);


    if(!taskData.responsibleId)
    {
      setDialogMessage(intl.formatMessage({ id: "noResponsible", defaultMessage: "No responsible selected!" }));
      setAlertType(false);
      setIsDialogOpen(true);
      return;
    }
    const dataToSend = {
      title: taskData.title,
      description: taskData.description,
      plannedStartDate: taskData.plannedStartDate,
      plannedEndDate: taskData.plannedEndDate,
      responsibleId: taskData.responsibleId,
      projectId: projectId,
    };
    const response = await taskService.createTask(dataToSend, projectId);
    if (response.status === 204) {
      setDialogMessage(intl.formatMessage({ id: "taskCreatedSuccess", defaultMessage: "Task created successfully!" }));
      setAlertType(true);
      setIsDialogOpen(true);
      setOnConfirm(() => {
        onTaskCreated();
        onClose();
        setIsDialogOpen(false);
      });
      setTaskData({
        title: "",
        description: "",
        plannedStartDate: format(today, "yyyy-MM-dd'T'00:00:00'Z'"),
        duration: 1,
        plannedEndDate: format(addDays(today, 1), "yyyy-MM-dd'T'00:00:00'Z'"),
        responsibleId: "",
      });
    } else {
      const data = await response.json();
      setDialogMessage(data.message);
      setAlertType(true);
      setIsDialogOpen(true);
      setOnConfirm(() => {});
    }
  };

  if (!isOpen) return null;

  const maxStartDate = taskData.plannedEndDate ? new Date(taskData.plannedEndDate) : null;
  if (maxStartDate) {
    maxStartDate.setDate(maxStartDate.getDate() - 1);
  }

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
              required
              maxLength={25}
              minLength={1}
            />
            <label className={styles.label}>
              <FormattedMessage id="description" defaultMessage="Description" />
            </label>
            <textarea
              className={styles.textarea}
              name="description"
              value={taskData.description}
              onChange={handleDescriptionChange}
              required
              maxLength={2048}
            />
            <label className={styles.label}>
              <FormattedMessage id="initialPlannedDate" defaultMessage="Initial Planned Date" />
            </label>
            <input
              type="date"
              className={styles.datePicker}
              value={taskData.plannedStartDate.substring(0, 10)}
              onChange={(e) => handleDateChange(new Date(e.target.value), "plannedStartDate")}
              required
              min={format(today, "yyyy-MM-dd")}
            />
            <label className={styles.label}>
              <FormattedMessage id="duration" defaultMessage="Duration (days)" />
            </label>
            <input
              type="number"
              className={styles.numberPicker}
              name="duration"
              value={taskData.duration}
              onChange={handleDurationChange}
              required
              min={1}
              max={30}
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
