import React, { useEffect } from "react";
import { useState } from "react";
import ReactQuill from "react-quill";
import { FormattedMessage, useIntl } from "react-intl";

import styles from "./ProjectBasicInfo.module.css";
import Button from '../buttons/landingPageBtn/Button.jsx'
import useLabStore from "../../stores/useLabStore.jsx";



const ProjectBasicInfo = ({projectInfo}) => {
  const intl = useIntl();
    console.log(projectInfo)
    const { laboratories, fetchLaboratories } = useLabStore();
    useEffect(() => {
      fetchLaboratories();
  }, [fetchLaboratories]);


    return(
        <div className={styles.projectContainer}>
        <section className={styles.projectHeader}>
          <h1>{projectInfo.name}</h1>
          <p>{projectInfo.description}</p>
        </section>
        <div className={styles.formContainer}>
        <form className={styles.form} >
                    <label className={styles.label}>Project Name</label>
                    <input
                        className={styles.input}
                        type="text"
                        name="name"
                        value={projectInfo.name}
                    />
                    <label className={styles.label}>Description</label>
                    <ReactQuill
                        theme="snow"
                        value={projectInfo.description}
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
                        value={projectInfo.motivation}
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
                        value={projectInfo.conclusionDate ? new Date(projectInfo.conclusionDate).toISOString().substring(0, 16) : ''}
                    /> 
                </form>
            
              
        </div>
      </div>
    )
    };

export default ProjectBasicInfo;