import React, { useState } from 'react';
import styles from './CreateProjectModal.module.css';

const CreateProjectModal = ({ isOpen, onClose }) => {
    

    const [projectData, setProjectData] = useState({
        projectName: '',
        laboratory: '',
        skills: '',
        keywords: '',
        users: '',
        assets: ''
    });

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
                    <input
                        className={styles.input}
                        type="text"
                        name="laboratory"
                        value={projectData.laboratory}
                        onChange={handleChange}
                    />

                    <label className={styles.label}>Skills</label>
                    <input
                        className={styles.input}
                        type="text"
                        name="skills"
                        value={projectData.skills}
                        onChange={handleChange}
                    />

                    <label className={styles.label}>Keywords</label>
                    <input
                        className={styles.input}
                        type="text"
                        name="keywords"
                        value={projectData.keywords}
                        onChange={handleChange}
                    />

                    <label className={styles.label}>Users</label>
                    <input
                        className={styles.input}
                        type="text"
                        name="users"
                        value={projectData.users}
                        onChange={handleChange}
                    />

                    <label className={styles.label}>Assets</label>
                    <input
                        className={styles.input}
                        type="text"
                        name="assets"
                        value={projectData.assets}
                        onChange={handleChange}
                    />

                    <button type="submit" className={styles.button}>Submit</button>
                </form>
            </div>
        </div>
    );
};

export default CreateProjectModal;
