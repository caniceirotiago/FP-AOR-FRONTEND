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



const ProjectBasicInfo = ({projectInfo, states, laboratories, setProjectInfo, isEditing, updateProjectInfo}) => {
  const quillDescriptionRef = useRef(null);
  const quillMotivationRef = useRef(null);
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

    const handleUpdateProject = () => {
      updateProjectInfo();
    }
  
    if (!projectInfo) {
      return null; // or a loading indicator
    }



    return(
        <div className={styles.projectContainer}>
        <section className={styles.projectHeader}>
          <h1>{projectInfo.name}</h1>
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
                        disabled={!isEditing}
                    />
                    <label className={styles.label}>Description</label>
                    {isEditing ? (
                       <ReactQuill
                        ref={quillDescriptionRef}
                        theme="snow"
                        value={projectInfo.description}
                        className={styles.quillEditor} 
                        modules={{ toolbar: toolbarOptions }}
                        onChange={(value) => handleQuillChange("description", value)}
                    />) 
                      : 
                    (<div className={styles.descriptionText}>
                      <div dangerouslySetInnerHTML={{ __html: projectInfo.description }} />
                    </div>)}
                   
                    <label className={styles.label}>Motivation</label>
                    {isEditing ? (  
                      <ReactQuill
                        ref={quillMotivationRef}
                        theme="snow"
                        value={projectInfo.motivation}
                        className={styles.quillEditor} 
                        modules={{ toolbar: toolbarOptions }}
                        onChange={(value) => handleQuillChange("motivation", value)}
                    />)
                      :
                      (<div className={styles.motivationText}>
                        <div dangerouslySetInnerHTML={{ __html: projectInfo.motivation }} />
                      </div>)}
                    
                    <label className={styles.label}>State</label>
                    <FormattedMessage id="projectcStatusPlaceholder" defaultMessage="Select project state">
                           {(placeholder) => (
                           <select
                              className={styles.select}
                              name="state"
                              id="state-field"
                              value={projectInfo.state}
                              onChange={handleInputChange}
                              disabled={!isEditing}
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
                              disabled={!isEditing}
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
                        disabled={!isEditing}
                    /> 
                    {isEditing && <Button className={styles.button} onClick={handleUpdateProject} tradId="updateProject" defaultText="Update Project Basic Information" btnColor={"var(--btn-color2)"}/> 
}
                </form>
            
              
        </div>
      </div>
    )
    };

export default ProjectBasicInfo;