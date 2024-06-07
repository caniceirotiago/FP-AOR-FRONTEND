import React from 'react';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import ProjectBasicInfo from '../../components/ProjectPageComponents/ProjectBasicInfo.jsx';
import projectService from '../../services/projectService.jsx';
import AttributeEditor from '../../components/reactSelect/AttributeEditor.jsx';
import useProjectStatesStore from '../../stores/useProjectStatesStore.jsx';
import useLabStore from '../../stores/useLabStore.jsx';
import { useCallback } from 'react';
import useProjectRolesStore from '../../stores/useProjectRolesStore.jsx';
import Button from '../../components/buttons/landingPageBtn/Button.jsx'
import styles from './ProjectPage.module.css';



const ProjectPage = () => {
  const [isEditing, setIsEditing] = useState(false); 
  const { id } = useParams();
  const [isTheProjectNotExistant, setIsTheProjectNotExistant] = useState();
  const [projectInfo, setProjectInfo] = useState(
    {
      name: "",
      description: "",
      motivation: "",
      state: "",
      laboratory: "",
      keywords: [],
      skills: [],
      users: []
    }
  );
  const{states, fetchProjectStates} = useProjectStatesStore();
  const{roles, fetchProjectRoles} = useProjectRolesStore();
  const { laboratories, fetchLaboratories } = useLabStore();
  const fetchProjectData = useCallback(async () => {
    try {
      const response = await projectService.getProjectById(id);
      if (response.status === 404) {
        setIsTheProjectNotExistant(true);
        return;
      }
      const projectData = await response.json();
      setProjectInfo(projectData);
    } catch (error) {
      console.error("Error fetching project data:", error.message);
    }
  }, [id]);

  useEffect(() => {
    fetchProjectData();
    fetchLaboratories();
    fetchProjectRoles();
    fetchProjectStates();
  }, []);
          
  const handleEditModeTrue = (e) => {
    setIsEditing(true);
  }
  const handleEditModeFalse = (e) => {
    setIsEditing(false);
  }
  const handleUpdateProjectInfo = async () => {
    const projectUpdateData = {
      name: projectInfo.name,
      description: projectInfo.description,
      motivation: projectInfo.motivation,
      state: projectInfo.state,
      laboratoryId: projectInfo.laboratory.id,
      conclusionDate: projectInfo.conclusionDate ? new Date(projectInfo.conclusionDate).toISOString() : null
  };
    try {
      await projectService.updateProject(projectInfo.id, projectUpdateData);
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update project info:", error);
    }
  }

  const canEdit = projectInfo.members && projectInfo.members.some(user => user.userId ===  parseInt(localStorage.getItem('userId')) && user.role === 'PROJECT_MANAGER' && user.accepted);
  console.log(projectInfo);

  return (
    <>
      {isTheProjectNotExistant ? (
        <div className={styles.projectPage}>
          <h1>Project Not Found</h1>
        </div>
      ) : (
        <div className={styles.projectPage}>
          <div className={styles.basicInfo}>
            {canEdit &&
            <div className={styles.btnContainer}>
              {!isEditing && (
                <Button className={styles.button} type="button" onClick={handleEditModeTrue} tradId="editBtnProfForm" defaultText="Edit" btnColor={"var(--btn-color2)"} />
              )}
              {isEditing && (
                <Button className={styles.button} type="button" onClick={handleEditModeFalse} tradId="editBtnProfFormFalse" defaultText="Exit Edit Mode" btnColor={"var(--btn-color2)"} />
              )}
            </div>
            }
            
            <div className={styles.formContainer}>
              <ProjectBasicInfo
                projectInfo={projectInfo}
                states={states}
                laboratories={laboratories}
                setProjectInfo={setProjectInfo}
                isEditing={isEditing}
                updateProjectInfo={handleUpdateProjectInfo}
              />
            </div>
            <div className={styles.usersContainer}>
              <AttributeEditor title="users" editMode={isEditing} mainEntity={"project"} creationMode={false} projectId={id} createdBy={projectInfo.createdBy}/>
            </div>
          </div>
          <div className={styles.attributesContainer}>
            <AttributeEditor title="skills" editMode={isEditing} mainEntity={"project"} creationMode={false} projectId={id} />
            <AttributeEditor title="keywords" editMode={isEditing} mainEntity={"project"} creationMode={false} projectId={id} />
          </div>
        </div>
      )}
    </>
  );

};

export default ProjectPage;
