import React, { useState, useEffect, useRef } from "react";
import styles from "./EditTaskModal.module.css";
import { FormattedMessage, useIntl } from "react-intl";
import AttributeEditor from "../reactSelect/AttributeEditor.jsx";
import { format } from "date-fns";
import "react-datepicker/dist/react-datepicker.css";
import useDialogModalStore from "../../stores/useDialogModalStore.jsx";
import taskService from "../../services/taskService.jsx";
import useTaskStatesStore from "../../stores/useTaskStatesStore.jsx";
import usePlanningPageStore from "../../stores/usePlanningPageStore.jsx";



const EditTaskModal = ({isOpen,onClose,projectId,onTaskUpdate,taskId,}) => {
  const {isThePlanEditable} = usePlanningPageStore();
  const quillRef = useRef(null);
  const { setDialogMessage, setIsDialogOpen, setAlertType, setOnConfirm } =
    useDialogModalStore();
  const { states, fetchTaskStates } = useTaskStatesStore();
  const intl = useIntl();
  const [taskData, setTaskData] = useState({
    title: "",
    description: "",
    plannedStartDate: "",
    plannedEndDate: "",
    responsibleId: "",
    state: "",
    registeredExecutors: [],
    nonRegisteredExecutors: "",
    dependentTasks: [],
    prerequisites: [],
    isDeleted: "",
  });

  const fetchTaskDataById = async () => {
    const response = await taskService.getTaskById(taskId);
    if (response.status === 200) {
      const data = await response.json();
      setTaskData({
        title: data.title,
        description: data.description,
        plannedStartDate: data.plannedStartDate,
        plannedEndDate: data.plannedEndDate,
        responsibleId: data.responsibleId,
        state: data.state,
        registeredExecutors: data.registeredExecutors,
        nonRegisteredExecutors: data.nonRegisteredExecutors,
        dependentTasks: data.dependentTasks,
        prerequisites: data.prerequisites,
        isDeleted: data.isDeleted,
      });
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchTaskStates();
      fetchTaskDataById();
    }
  }, [isOpen]);

  const handleChange = (e) => {
    setTaskData({ ...taskData, [e.target.name]: e.target.value });
  };

  const handleDescriptionChange = (value) => {
    const cleanValue = value.replace(/[^a-zA-Z0-9 .,;!?'"@#$%^&*()_+=\-\[\]\{\}:<>/\\|`~]/g, "");
    if (cleanValue.length <= 200) {
      setTaskData((prevData) => ({ ...prevData, description: cleanValue }));
    }
  };

  useEffect(() => {
    if (quillRef.current) {
      const quill = quillRef.current.getEditor();
      quill.on('text-change', () => {
        const content = quill.getText();
        if (content.length > 200) {
          quill.deleteText(200, quill.getLength());
        }
        const cleanContent = content.replace(/[^a-zA-Z0-9 .,;!?'"@#$%^&*()_+=\-\[\]\{\}:<>/\\|`~]/g, "");
        if (cleanContent.length !== content.length) {
          quill.deleteText(0, quill.getLength());
          quill.clipboard.dangerouslyPasteHTML(0, cleanContent);
        }
        setTaskData((prevData) => ({ ...prevData, description: quill.root.innerHTML }));
      });
    }
  }, []);

  const handleDateChange = (date, dateType) => {
    const formattedDate = format(date, "yyyy-MM-dd'T'00:00:00'Z'");
    setTaskData((prevData) => ({ ...prevData, [dateType]: formattedDate }));
  };

  const handleTaskDelete = async () => {
    setDialogMessage("Are you sure you want to delete this task?");
    setAlertType(false);
    setIsDialogOpen(true);
    setOnConfirm(async () => {
      await DeleteTask();
    });
  };

  const DeleteTask = async () => {
    const response = await taskService.deleteTask(taskId, projectId);
    if (response.status === 204) {
      setDialogMessage(
        intl.formatMessage({
          id: "taskDeletedSuccess",
          defaultMessage: "Task deleted successfully",
        })
      );
      setAlertType(true);
      setIsDialogOpen(true);
      setOnConfirm(() => {});
      onClose();
      onTaskUpdate();
    } else {
      setDialogMessage(
        intl.formatMessage({
          id: "taskDeleteError",
          defaultMessage: "An error occurred while deleting the task",
        })
      );
      setAlertType("error");
      setIsDialogOpen(true);
      setOnConfirm(() => {});
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    const registeredExecutorsIds = taskData.registeredExecutors.map(
      (executor) => executor.id
    );

    const dataToSend = {
      taskId: taskId,
      title: taskData.title,
      description: taskData.description,
      plannedStartDate: taskData.plannedStartDate
        ? new Date(taskData.plannedStartDate).toISOString()
        : null,
      plannedEndDate: taskData.plannedEndDate
        ? new Date(taskData.plannedEndDate).toISOString()
        : null,
      responsibleUserId: taskData.responsibleId.id,
      state: taskData.state,
      registeredExecutors: registeredExecutorsIds,
      nonRegisteredExecutors: taskData.nonRegisteredExecutors,
    };
    const response = await taskService.detailedUpdateTask(
      dataToSend,
      projectId
    );
    if (response.status === 204) {
      setDialogMessage(
        intl.formatMessage({
          id: "taskUpdatedSuccess",
          defaultMessage: "Task updated successfully",
        })
      );
      setAlertType(true);
      setIsDialogOpen(true);
      setOnConfirm(() => {});
      onClose();
      onTaskUpdate();
    } else {
      setDialogMessage(
        intl.formatMessage({
          id: "taskUpdateError",
          defaultMessage: "An error occurred while updating the task",
        })
      );
      setAlertType("error");
      setIsDialogOpen(true);
      setOnConfirm(() => {});
    }
  };
  console.log(taskData);
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
              maxLength={25}
              minLength={1}
              value={taskData.title}
              onChange={handleChange}
              required={true}
              disabled={!isThePlanEditable}
            />
            <label className={styles.label}>
              <FormattedMessage id="tableHeaderState" defaultMessage="State" />
            </label>
            <select
              className={styles.select}
              type="text"
              name="state"
              value={taskData.state}
              onChange={handleChange}
              required={true}
              disabled={!isThePlanEditable}
            >
              {states.map((state) => (
                <option key={state.id} value={state}>
                  {state}
                </option>
              ))}
            </select>
            <label className={styles.label}>
              <FormattedMessage id="description" defaultMessage="Description" />
            </label>
            < div className={styles.descriptionText}>
            {isThePlanEditable ? (
             //textorico
             <></>
            ) : (
                <div dangerouslySetInnerHTML={{ __html: taskData.description }} />
          )}

              </div>
            <label className={styles.label}>
              <FormattedMessage
                id="initialPlannedDate"
                defaultMessage="Initial Planned Date"
              />
            </label>
            <input
              type="date"
              disabled={!isThePlanEditable}
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
              disabled={!isThePlanEditable}
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
                taskData={taskData}
                setTaskData={setTaskData}
                projectId={projectId}
                creationMode={false}
                title="Responsible user"
                editMode={isThePlanEditable}
                mainEntity={"task"}
                taskResponsibleId={taskData.responsibleId}

              />
            </div>
            <div className={styles.attributeEditor}>
              <AttributeEditor
                taskData={taskData}
                setTaskData={setTaskData}
                projectId={projectId}
                creationMode={false}
                title="Registered executers"
                editMode={isThePlanEditable}
                mainEntity={"task"}
                registeredExecutors={taskData.registeredExecutors}
              />
            </div>
            <label className={styles.label}>
              <FormattedMessage
                id="nonRegisteredExecutors"
                defaultMessage="Non Registered Executors"
              />
            </label>
            <textarea
              className={styles.textarea}
              name="nonRegisteredExecutors"
              value={taskData.nonRegisteredExecutors}
              onChange={handleChange}
              maxLength={2048}
              disabled={!isThePlanEditable}
            />{isThePlanEditable && (<>
              <div  className={styles.button} onClick={handleTaskDelete}>
                <FormattedMessage id="delete" defaultMessage="Delete Task" />
              </div>
              <button type="submit" className={styles.button}>
                <FormattedMessage id="submit" defaultMessage="Submit" />
              </button>
            </>)}
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditTaskModal;
