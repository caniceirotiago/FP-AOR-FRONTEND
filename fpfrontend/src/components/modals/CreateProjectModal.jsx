import React, { useState, useEffect } from 'react';
import styles from './CreateProjectModal.module.css';
import useLabStore from '../../stores/useLabStore.jsx';
import { FormattedMessage } from 'react-intl';
import AttributeEditor from '../reactSelect/AttributeEditor.jsx';
import { format } from 'date-fns';
import 'react-datepicker/dist/react-datepicker.css';
import projectService from '../../services/projectService.jsx';
import useDialogModalStore from '../../stores/useDialogModalStore.jsx';

const CreateProjectModal = ({ isOpen, onClose }) => {
    const { setDialogMessage, setIsDialogOpen, setAlertType, setOnConfirm } = useDialogModalStore();
    const { laboratories, fetchLaboratories } = useLabStore();
    const [projectData, setProjectData] = useState({
        name: '',
        conclusionDate: null,
        description: '',
        motivation: '',
        laboratoryId: '',
        skills: [],
        keywords: [],
        users: [],
        assets: ''
    });

    useEffect(() => {
        fetchLaboratories();
    }, [fetchLaboratories]);

    const handleSkillChange = (newSkills) => {
        setProjectData((prevData) => ({ ...prevData, skills: newSkills }));
    };
    const handleKeywordChange = (newKeywords) => {
        setProjectData((prevData) => ({ ...prevData, keywords: newKeywords }));
    };
    const handleUserChange = (newUsers) => {
        setProjectData((prevData) => ({ ...prevData, users: newUsers }));
    };
    const handleAssetChange = (newAssets) => {
        setProjectData((prevData) => ({ ...prevData, assets: newAssets }));
    };

    const handleChange = (e) => {
        setProjectData({ ...projectData, [e.target.name]: e.target.value });
    };
    const handleDescriptionChange = (e) => {
        setProjectData((prevData) => ({ ...prevData, description: e.target.value }));
    };
    const handleMotivationChange = (e) => {
        setProjectData((prevData) => ({ ...prevData, motivation: e.target.value }));
    };
    const handleDateChange = (date) => {
        const formattedDate = format(date, "yyyy-MM-dd'T'00:00:00'Z'");
        setProjectData((prevData) => ({ ...prevData, conclusionDate: formattedDate }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const dataToSend = {
            name: projectData.name,
            description: projectData.description,
            motivation: projectData.motivation,
            laboratoryId: Number(projectData.laboratoryId),
            conclusionDate: projectData.conclusionDate,
            skills: projectData.skills.map(skill => ({ name: skill.name, type: skill.type })),
            keywords: projectData.keywords.map(keyword => ({ name: keyword.name })),
            assets: projectData.assets.map(asset => ({ name: asset.name, usedQuantity: asset.usedQuantity })),
            users: projectData.users.map(user => ({ username: user.user.username }))
        };
        console.log(dataToSend);
        const response = await projectService.createProject(dataToSend);
        if (response.status === 204) {
            setDialogMessage("Project created successfully!");
            setAlertType(true);
            setIsDialogOpen(true);
            setOnConfirm(() => {
                onClose();
                setIsDialogOpen(false);
            });
        }
        else {
            const data = await response.json();
            setDialogMessage(data.errorMessage);
            setAlertType(true);
            setIsDialogOpen(true);
            setOnConfirm(() => {
            });
        }
    };

    if (!isOpen) return null;
    return (
        <div className={styles.modal}>
            <div className={styles.modalContent}>
                <div className={styles.closeButton} onClick={onClose}>X</div>
                <div className={styles.formContainer}>
                    <form className={styles.form} onSubmit={handleSubmit}>
                        <label className={styles.label}>Project Name</label>
                        <input
                            className={styles.input}
                            type="text"
                            name="name"
                            value={projectData.name}
                            onChange={handleChange}
                        />
                        <label className={styles.label}>Description</label>
                        <textarea
                            className={styles.textarea}
                            name="description"
                            value={projectData.description}
                            onChange={handleDescriptionChange}
                        />
                        <label className={styles.label}>Motivation</label>
                        <textarea
                            className={styles.textarea}
                            name="motivation"
                            value={projectData.motivation}
                            onChange={handleMotivationChange}
                        />

                        <label className={styles.label}>Laboratory</label>
                        <FormattedMessage id="laboratoryPlaceholder" defaultMessage="Select your laboratory">
                            {(placeholder) => (
                                <select
                                    className={styles.select}
                                    name="laboratoryId"
                                    onChange={handleChange}
                                    id="laboratoryId-field"
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
                            value={projectData.conclusionDate ? new Date(projectData.conclusionDate).toISOString().substring(0, 10) : ''}
                            onChange={(e) => handleDateChange(new Date(e.target.value))}
                        />
                        <div className={styles.attributeEditor}>
                            <AttributeEditor title="skills" editMode={true} mainEntity={"project"} creationMode={true} onAttributesChange={handleSkillChange} />
                            <AttributeEditor title="keywords" editMode={true} mainEntity={"project"} creationMode={true} onAttributesChange={handleKeywordChange} />
                            <AttributeEditor title="users" editMode={true} mainEntity={"project"} creationMode={true} onAttributesChange={handleUserChange} />
                            <AttributeEditor title="assets" editMode={true} mainEntity={"project"} creationMode={true} onAttributesChange={handleAssetChange} />
                        </div>
                        <button type="submit" className={styles.button}>Submit</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateProjectModal;
