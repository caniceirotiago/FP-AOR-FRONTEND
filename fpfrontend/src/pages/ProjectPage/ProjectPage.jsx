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
import { FaEdit, FaCheck } from 'react-icons/fa';
import ApprovalModal from '../../components/modals/ApprovalModal.jsx';
import { set } from 'date-fns';
import LogsList from '../../components/ProjectPageComponents/LogsList/LogsList.jsx';



const ProjectPage = () => {
  const [isApprovalModalOpen, setIsApprovalModalOpen] = useState(false);
  const [projectLogs, setProjectLogs] = useState([]);  
  const [approveOrReject, setApproveOrReject] = useState("");
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
  const fetchProjectLogs = useCallback(async () => {
    try {
      const response = await projectService.getProjectLogsByProjectId(id);
      const logs = await response.json();
      setProjectLogs(logs);
    } catch (error) {
      console.error("Error fetching project logs:", error.message);
    }
  }
  , [id]);

  useEffect(() => {
    fetchProjectData();
    fetchLaboratories();
    fetchProjectRoles();
    fetchProjectLogs();
    fetchProjectStates();
  }, [isApprovalModalOpen]);
          
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
  console.log(projectUpdateData + "update data");
  console.log(projectUpdateData)
    try {
      await projectService.updateProject(projectInfo.id, projectUpdateData);
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update project info:", error);
    }
  }
  const handleApproveProject = async (wantToApprove) => {
    setApproveOrReject(wantToApprove ? "Approve Project" : "Reject Project");
    setIsApprovalModalOpen(true);
    
  }
 


  console.log(projectLogs);
  const canEdit = projectInfo.members && projectInfo.members.some(user => user.userId ===  parseInt(localStorage.getItem('userId')) && user.role === 'PROJECT_MANAGER' && user.accepted);
  const isInApprovalMode = localStorage.getItem('role') === "1" && projectInfo.state === "READY";
  return (
    <>
      {isTheProjectNotExistant ? (
        <div className={styles.projectPage}>
          <h1>Project Not Found</h1>
        </div>
      ) : (
        <div className={styles.projectPage}>
          <ApprovalModal isOpen={isApprovalModalOpen} onClose={() => setIsApprovalModalOpen(false)} title={approveOrReject} projectId={projectInfo.id}/>
          <div className={styles.controlPanel}>
              <div className={styles.btns}>
                {(canEdit && projectInfo.state !== "FINISHED" && projectInfo.state !== "CANCELLED") &&
                  <>{!isEditing &&  (
                    <button  onClick={handleEditModeTrue} className={`${styles.iconButton} ${styles.createButton}`} data-text="Edit">
                      <FaEdit className={styles.svgIcon} />
                    </button>
                  )}
                  {isEditing &&  (
                    <button onClick={handleEditModeFalse} className={`${styles.iconButton} ${styles.createButton}`} data-text="Back">
                      <FaCheck className={styles.svgIcon} />
                    </button>
                  )}
                  </>
                }
            </div>
            <div className={styles.otherControls}>
                {isInApprovalMode && 
                <>
                <div className={styles.approvalDiv}>
                  <p className={styles.approvalText}>This project is waiting for approval!</p>
                  <button className={styles.approvalBtn} onClick={() => handleApproveProject(true)}>Approve Project</button>
                  <button className={styles.rejectBtn} onClick={() => handleApproveProject(false)}>Reject Project</button>
                </div>
                </>}
            </div>
            <div className={styles.btns}></div> {/*  //This div is empty just to make a ghost effect */}
          </div>
          <div className={styles.basicInfo}>

            <section className={styles.projectHeader}>
              <h1>{projectInfo.name}</h1>
            </section>
            <div className={styles.firstSeccion}>
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
          </div>
          <div className={styles.secondSeccion}>
            <div className={styles.attributesContainer}>
              <AttributeEditor title="skills" editMode={isEditing} mainEntity={"project"} creationMode={false} projectId={id} />
              <AttributeEditor title="keywords" editMode={isEditing} mainEntity={"project"} creationMode={false} projectId={id} />
            </div>
            <div className={styles.attributesContainer}>
                  <LogsList logs={projectLogs} />
            </div>
          </div>
        </div>
      )}
    </>
  );

};

export default ProjectPage;
