import React, { useState, useEffect } from 'react';
import styles from './CreateProjectModal.module.css';
import  useLabStore  from '../../stores/useLabStore.jsx';
import { FormattedMessage } from 'react-intl';
import AttributeEditor from '../reactSelect/AttributeEditor.jsx';

const CreateProjectModal = ({ isOpen, onClose }) => {
    const { laboratories, fetchLaboratories } = useLabStore();
    const [projectData, setProjectData] = useState({
        projectName: '',
        laboratory: '',
        skills: [],
        keywords: '',
        users: '',
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

    const handleSubmit = (e) => {
        // e.preventDefault();
        // console.log('Project Data:', projectData);
        // onClose(); 
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
                        name="projectName"
                        value={projectData.projectName}
                        onChange={handleChange}
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

                    <AttributeEditor title="skills" editMode={true} mainEntity={"project"} creationMode={true} onAttributesChange={handleSkillChange}/>
                    <AttributeEditor title="keywords" editMode={true} mainEntity={"project"} creationMode={true} onAttributesChange={handleKeywordChange}/>                
                    <AttributeEditor title="users" editMode={true} mainEntity={"project"} creationMode={true} onAttributesChange={handleUserChange}/>                
                    <AttributeEditor title="assets" editMode={true} mainEntity={"project"} creationMode={true} onAttributesChange={handleAssetChange}/>                

                    <button type="submit" className={styles.button}>Submit</button>
                </form>
            </div>
        </div>
    );
};

export default CreateProjectModal;
