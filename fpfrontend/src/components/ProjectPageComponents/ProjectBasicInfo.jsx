import React, { useEffect } from "react";
import { useState } from "react";
import ReactQuill from "react-quill";
import { FormattedMessage, useIntl } from "react-intl";
import styles from "./ProjectBasicInfo.module.css";
import Button from '../buttons/landingPageBtn/Button.jsx'
import useLabStore from "../../stores/useLabStore.jsx";
import useProjectStatesStore from "../../stores/useProjectStatesStore.jsx";
import { useMemo } from "react";
import { useRef } from "react";



const ProjectBasicInfo = ({projectInfo, states, laboratories, setProjectInfo}) => {
  const quillDescriptionRef = useRef(null);
  const quillMotivationRef = useRef(null);
    console.log(projectInfo)
    const toolbarOptions = useMemo(() => [
      [{ 'font': [] }],
      [{ 'color': [] }, { 'background': [] }],
      [{ size: [] }],
      ['bold', 'italic', 'underline', 'strike'],
    ], []);
    const handleInputChange = (event) => {
      const { name, value } = event.target;
      setProjectInfo((prevInfo) => ({
        ...prevInfo,
        [name]: value,
      }));
    };
  
    const handleQuillChange = (name, value) => {
      setProjectInfo((prevInfo) => ({
        ...prevInfo,
        [name]: value,
      }));
    };
  
    if (!projectInfo) {
      return null; // or a loading indicator
    }



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
                        onChange={handleInputChange}
                    />
                    <label className={styles.label}>Description</label>
                    <ReactQuill
                        ref={quillDescriptionRef}
                        theme="snow"
                        value={projectInfo.description}
                        className={styles.quillEditor} 
                        modules={{ toolbar: toolbarOptions }}
                        onChange={(value) => handleQuillChange("description", value)}
                    />
                    <label className={styles.label}>Motivation</label>
                    <ReactQuill
                        ref={quillMotivationRef}
                        theme="snow"
                        value={projectInfo.motivation}
                        className={styles.quillEditor} 
                        modules={{ toolbar: toolbarOptions }}
                        onChange={(value) => handleQuillChange("description", value)}
                    />
                    <label className={styles.label}>State</label>
                    <FormattedMessage id="projectcStatusPlaceholder" defaultMessage="Select project state">
                           {(placeholder) => (
                           <select
                              className={styles.select}
                              name="state"
                              id="state-field"
                              value={projectInfo.state}
                              onChange={handleInputChange}
                           >
                              <option value="">{placeholder}</option>
                              {states.map((state) => (
                              <option key={state} value={state}>
                                 {state}
                              </option>
                              ))}
                           </select>
                           )}
                     </FormattedMessage>
                    <label className={styles.label}>Laboratory</label>
                    <FormattedMessage id="laboratoryPlaceholder" defaultMessage="Select your laboratory">
                           {(placeholder) => (
                           <select
                              className={styles.select}
                              name="laboratoryId"
                              id="laboratoryId-field"
                              value={projectInfo?.laboratory.id || ''}
                              onChange={handleInputChange}
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
                        onChange={handleInputChange}
                    /> 
                </form>
            
              
        </div>
      </div>
    )
    };

export default ProjectBasicInfo;