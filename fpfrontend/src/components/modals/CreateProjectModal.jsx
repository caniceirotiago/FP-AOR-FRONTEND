import React, { useState, useEffect } from 'react';
import styles from './CreateProjectModal.module.css';
import  useLabStore  from '../../stores/useLabStore.jsx';
import { FormattedMessage } from 'react-intl';
import AttributeEditor from '../reactSelect/AttributeEditor.jsx';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { format } from 'date-fns';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import projectService from '../../services/projectService.jsx';
import useDialogModalStore from '../../stores/useDialogModalStore.jsx';


const CreateProjectModal = ({ isOpen, onClose }) => {
    const {setDialogMessage, setIsDialogOpen, setAlertType, setOnConfirm} = useDialogModalStore();
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
    const handleDescriptionChange = (value) => {
        setProjectData((prevData) => ({ ...prevData, description: value }));
    };
    const handleMotivationChange = (value) => {
        setProjectData((prevData) => ({ ...prevData, motivation: value }));
    };
    const handleDateChange = (date) => {
        const formattedDate = format(date, "yyyy-MM-dd'T'HH:mm:ss'Z'");
        setProjectData((prevData) => ({ ...prevData, conclusionDate: formattedDate }));
    };

    const handleSubmit = async (e) => {
         e.preventDefault();
        const dataToSend= {
            name: projectData.name,
            description: projectData.description,
            motivation: projectData.motivation,
            laboratoryId: Number(projectData.laboratoryId),
            conclusionDate: projectData.conclusionDate,
            skills: projectData.skills.map(skill => ({ name: skill.name, type: skill.type })), 
            keywords: projectData.keywords.map(keyword => ({ name: keyword.name })),
            users: projectData.users.map(user => ({ username: user.user.username }))
        };
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

    };
    if (!isOpen) return null;
    return (
        <div className={styles.modal}>
            <div className={styles.modalContent}>
                <div className={styles.closeButton} onClick={onClose}>X</div>
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
                    <ReactQuill
                        theme="snow"
                        value={projectData.description}
                        onChange={handleDescriptionChange}
                        className={styles.quillEditor} 
                        modules={{
                        toolbar: [
                            [{ 'font': [] }],
                            [{ 'color': [] }, { 'background': [] }],
                            [{ size: [] }],
                            ['bold', 'italic', 'underline', 'strike'],
                        ]
                        }}
                    />
                    <label className={styles.label}>Motivation</label>
                    <ReactQuill
                        theme="snow"
                        value={projectData.motivation}
                        onChange={handleMotivationChange}
                        className={styles.quillEditor} 
                        modules={{
                        toolbar: [
                            [{ 'font': [] }],
                            [{ 'color': [] }, { 'background': [] }],
                            [{ size: [] }],
                            ['bold', 'italic', 'underline', 'strike'],
                        ]
                        }}
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
                        type="datetime-local"
                        className={styles.datePicker}
                        value={projectData.conclusionDate ? new Date(projectData.conclusionDate).toISOString().substring(0, 16) : ''}
                        onChange={(e) => setProjectData({ ...projectData, conclusionDate: new Date(e.target.value).toISOString() })}
                    />

                    <AttributeEditor title="skills" editMode={true} mainEntity={"project"} creationMode={true} onAttributesChange={handleSkillChange}/>
                    <AttributeEditor title="keywords" editMode={true} mainEntity={"project"} creationMode={true} onAttributesChange={handleKeywordChange}/>                
                    <AttributeEditor title="users" editMode={true} mainEntity={"project"} creationMode={true} onAttributesChange={handleUserChange}/>                
                    {/* <AttributeEditor title="assets" editMode={true} mainEntity={"project"} creationMode={true} onAttributesChange={handleAssetChange}/>                 */}

                    <button type="submit" className={styles.button}>Submit</button>
                </form>
            </div>
        </div>
    );
};

export default CreateProjectModal;
