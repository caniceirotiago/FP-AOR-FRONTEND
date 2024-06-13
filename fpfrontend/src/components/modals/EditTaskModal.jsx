import React, { useState, useEffect } from 'react';
import styles from './CreateProjectModal.module.css';
import useLabStore from '../../stores/useLabStore.jsx';
import { FormattedMessage } from 'react-intl';
import AttributeEditor from '../reactSelect/AttributeEditor.jsx';
import { format } from 'date-fns';
import 'react-datepicker/dist/react-datepicker.css';
import projectService from '../../services/projectService.jsx';
import useDialogModalStore from '../../stores/useDialogModalStore.jsx';
import taskService from '../../services/taskService.jsx';
import useTaskStatesStore from '../../stores/useTaskStatesStore.jsx';

const EditTaskModal = ({ isOpen, onClose, projectId, onTaskCreated, taskId }) => {
    const { setDialogMessage, setIsDialogOpen, setAlertType, setOnConfirm } = useDialogModalStore();
    const {states, fetchTaskStates} = useTaskStatesStore();
    const [taskData, setTaskData] = useState({
        title: '',
        description: '',
        plannedStartDate: '',
        plannedEndDate: '',
        responsibleId: '',
        state: '',
        registeredExecutors: [],
        nonRegisteredExecutors: '',
        dependentTasks: [],
        prerequisites: [],

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
                prerequisites: data.prerequisites
            });
        }
    };

    useEffect (() => {
        if (isOpen) {
            fetchTaskStates();
            fetchTaskDataById();
        }
    }
    , [isOpen]);



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



    const handleSubmit = async (e) => {
        e.preventDefault();
        const dataToSend = {
            title: taskData.title,
            description: taskData.description,
            plannedStartDate: taskData.plannedStartDate,
            plannedEndDate: taskData.plannedEndDate,
            responsibleId: taskData.responsibleId,
            state: taskData.state,
            registeredExecutors: taskData.registeredExecutors,
            nonRegisteredExecutors: taskData.nonRegisteredExecutors,
            dependentTasks: taskData.dependentTasks,
            prerequisites: taskData.prerequisites,
        };
        const response = await taskService.updateTask(taskId, dataToSend);
        if (response.status === 200) {
            setDialogMessage('Task updated successfully');
            setAlertType('success');
            setIsDialogOpen(true);
            onClose();
            onTaskCreated();
        } else {
            setDialogMessage('An error occurred while updating the task');
            setAlertType('error');
            setIsDialogOpen(true);
        }
    };




    console.log(taskData)

    if (!isOpen) return null;
    return (
        <div className={styles.modal}>
            <div className={styles.modalContent}>
                <div className={styles.closeButton} onClick={onClose}>X</div>
                <div className={styles.formContainer}>
                    <form className={styles.form} onSubmit={handleSubmit}>
                        <label className={styles.label}>Task Title</label>
                        <input
                            className={styles.input}
                            type="text"
                            name="title"
                            value={taskData.title}
                            onChange={handleChange}
                        />
                        <label className={styles.label}>State</label>
                        <select
                            className={styles.select}
                            type="text"
                            name="state"
                            value={taskData.state}
                            onChange={handleChange}
                        >
                            {states.map((state) => (
                                <option key={state.id} value={state}>
                                    {state}
                                </option>
                            ))}
                        </select>
                        <label className={styles.label}>Description</label>
                        <textarea
                            className={styles.textarea}
                            name="description"
                            value={taskData.description}
                            onChange={handleDescriptionChange}
                        />
                        <label className={styles.label}>Initial Planned Date</label>
                        <input
                            type="date"
                            className={styles.datePicker}
                            value={taskData.plannedStartDate ? new Date(taskData.plannedStartDate).toISOString().substring(0, 10) : ''}
                            onChange={(e) => handleDateChange(new Date(e.target.value), 'plannedStartDate')}
                        />
                        <label className={styles.label}>Final Planned Date</label>
                        <input
                            type="date"
                            className={styles.datePicker}
                            value={taskData.plannedEndDate ? new Date(taskData.plannedEndDate).toISOString().substring(0, 10) : ''}
                            onChange={(e) => handleDateChange(new Date(e.target.value), 'plannedEndDate')}
                        />

                        <div className={styles.attributeEditor}>
                            <AttributeEditor  taskData={taskData} setTaskData={setTaskData} projectId={projectId} creationMode={false} title="Responsible user" editMode={true} mainEntity={"task"}  taskResponsibleId={taskData.responsibleId}/>
                        </div>
                        <div className={styles.attributeEditor}>
                            <AttributeEditor taskData={taskData} setTaskData={setTaskData} projectId={projectId} creationMode={false} title="Registered executers" editMode={true} mainEntity={"task"}  registeredExecutors={taskData.registeredExecutors}/>
                        </div>
                        <label className={styles.label}>Non Registered Executers</label>
                        <textarea
                            className={styles.textarea}
                            name="nonRegisteredExecutors"
                            value={taskData.nonRegisteredExecutors}
                            onChange={handleChange}
                        />
                        <button type="submit" className={styles.button}>Submit</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditTaskModal;
