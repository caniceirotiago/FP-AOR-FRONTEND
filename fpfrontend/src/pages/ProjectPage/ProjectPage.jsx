import React, { useCallback, useEffect, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { useParams, useNavigate } from "react-router-dom";
import ProjectBasicInfo from "../../components/ProjectPageComponents/ProjectBasicInfo.jsx";
import projectService from "../../services/projectService.jsx";
import AttributeEditor from "../../components/reactSelect/AttributeEditor.jsx";
import useProjectStatesStore from "../../stores/useProjectStatesStore.jsx";
import useLabStore from "../../stores/useLabStore.jsx";
import useProjectRolesStore from "../../stores/useProjectRolesStore.jsx";
import styles from "./ProjectPage.module.css";
import { FaEdit, FaCheck } from "react-icons/fa";
import ApprovalModal from "../../components/modals/ApprovalModal.jsx";
import LogsList from "../../components/ProjectPageComponents/LogsList/LogsList.jsx";
import useProjectStore from "../../stores/useProjectStore.jsx";
import GroupChatModal from "../../components/ProjectPageComponents/GroupChat/GroupChatModal";
import useGroupChatModalStore from "../../stores/useGroupChatModalStore";
import { FaChartGantt } from "react-icons/fa6";
import { stateColorsBriefcaseBackground } from "../../utils/colors/projectColors";
import { FaComments } from "react-icons/fa";
import { PROJECT_STATES, PROJECT_ROLES } from "../../utils/constants/constants";

const ProjectPage = () => {
  const navigate = useNavigate();
  const { setSelectedProjectId } = useProjectStore();
  const [isApprovalModalOpen, setIsApprovalModalOpen] = useState(false);
  const [approveOrReject, setApproveOrReject] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const { id } = useParams();
  const [isTheProjectNotExistant, setIsTheProjectNotExistant] = useState(false);
  const { fetchProjectStates } = useProjectStatesStore();
  const { fetchProjectRoles } = useProjectRolesStore();
  const { laboratories, fetchLaboratories } = useLabStore();

  const [projectInfo, setProjectInfo] = useState({
    name: "",
    description: "",
    motivation: "",
    state: "",
    laboratoryId: "",
    keywords: [],
    skills: [],
    users: [],
    assets: [],
  });

  const {
    isGroupChatModalOpen,
    setGroupChatModalOpen,
    selectedChatProject,
    setSelectedChatProject,
  } = useGroupChatModalStore();

  const intl = useIntl();

  const fetchProjectData = useCallback(async () => {
    try {
      const response = await projectService.getProjectById(id);
      if (response.status === 404) {
        setIsTheProjectNotExistant(true);
        return;
      }
      const projectData = await response.json();
      setProjectInfo({
        ...projectInfo,
        name: projectData.name,
        description: projectData.description,
        motivation: projectData.motivation,
        state: projectData.state,
        laboratoryId: projectData.laboratory.id, 
        conclusionDate: projectData.conclusionDate,
        createdBy: projectData.createdBy,
        members: projectData.members,
        id: projectData.id,

        
      });
    } catch (error) {
      console.error("Error fetching project data:", error.message);
    }
  }, [id]);

  useEffect(() => {
    fetchProjectData();
    fetchLaboratories();
    fetchProjectRoles();
    fetchProjectStates();
  }, [isApprovalModalOpen]);

  const handleEditModeTrue = (e) => {
    setIsEditing(true);
  };

  const handleEditModeFalse = (e) => {
    setIsEditing(false);
  };

  const handleUpdateProjectInfo = async () => {
    const projectUpdateData = {
      name: projectInfo.name,
      description: projectInfo.description,
      motivation: projectInfo.motivation,
      state: projectInfo.state,
      laboratoryId: projectInfo.laboratoryId,
      conclusionDate: projectInfo.conclusionDate
        ? new Date(projectInfo.conclusionDate).toISOString()
        : null,
    };
    try {
      console.log(projectUpdateData);
      console.log(projectInfo.id);
      await projectService.updateProject(projectInfo.id, projectUpdateData);
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update project info:", error);
    }
  };

  const handleApproveProject = async (approve) => {
    setApproveOrReject(approve);
    setIsApprovalModalOpen(true);
  };

  const handleClickToOpenProjectPlanningPage = () => {
    setSelectedProjectId(id);
    navigate(`/projectplanning`);
  };

  const handleOpenGroupChat = () => {
    setSelectedChatProject({ projectId: id, projectName: projectInfo.name });
    setGroupChatModalOpen(true);
  };

  const canEdit =
    projectInfo.members &&
    projectInfo.members.some(
      (user) =>
        user.userId === parseInt(localStorage.getItem("userId")) &&
        user.role === PROJECT_ROLES.PROJECT_MANAGER &&
        user.accepted
    );
  const canSeeAndEditProjectPlanning =
    projectInfo.members &&
    projectInfo.members.some(
      (user) =>
        user.userId === parseInt(localStorage.getItem("userId")) &&
        user.accepted
    );

  // Verifies if the user is "admin" level and the project is in the ready state
  const isInApprovalMode =
    localStorage.getItem("role") === "1" && projectInfo.state === PROJECT_STATES.READY;

  return (
    <>
      {isTheProjectNotExistant ? (
        <div className={styles.projectPage}>
          <h1>
            <FormattedMessage
              id="projectNotFound"
              defaultMessage="Project Not Found"
            />
          </h1>
        </div>
      ) : (
        <div className={styles.projectPage}>
          <ApprovalModal
            isOpen={isApprovalModalOpen}
            onClose={() => setIsApprovalModalOpen(false)}
            title={approveOrReject}
            approveOrReject={approveOrReject}
            projectId={projectInfo.id}
          />
          <div
            className={styles.outerControlPanel}
            style={{
              backgroundImage:
                stateColorsBriefcaseBackground[projectInfo.state],
            }}
          >
            <div className={styles.controlPanel}>
              <section className={styles.projectHeader}>
                <h1>{projectInfo.name}</h1>
              </section>
              <div className={styles.btns}>
                {canEdit &&
                  projectInfo.state !== PROJECT_STATES.FINISHED &&
                  projectInfo.state !== PROJECT_STATES.CANCELLED && (
                    <>
                      {!isEditing && (
                        <button
                          onClick={handleEditModeTrue}
                          className={`${styles.iconButton} ${styles.createButton}`}
                          data-text={intl.formatMessage({
                            id: "editBtnProfForm",
                            defaultMessage: "Edit",
                          })}
                        >
                          <FaEdit className={styles.svgIcon} />
                        </button>
                      )}
                      {isEditing && (
                        <button
                          onClick={handleEditModeFalse}
                          className={`${styles.iconButton} ${styles.createButton}`}
                          data-text={intl.formatMessage({
                            id: "back",
                            defaultMessage: "Back",
                          })}
                        >
                          <FaCheck className={styles.svgIcon} />
                        </button>
                      )}
                    </>
                  )}
                {canSeeAndEditProjectPlanning && (
                  <div>
                    <button
                      onClick={() => handleClickToOpenProjectPlanningPage()}
                      className={`${styles.iconButton} ${styles.createButton}`}
                      data-text={intl.formatMessage({
                        id: "projectPlanning",
                        defaultMessage: "Planning",
                      })}
                    >
                      <FaChartGantt className={styles.svgIcon} />
                    </button>
                  </div>
                )}
              </div>
              <div className={styles.otherControls}>
                {isInApprovalMode && (
                  <>
                    <div className={styles.approvalDiv}>
                      <p className={styles.approvalText}>
                        <FormattedMessage
                          id="waitingForApproval"
                          defaultMessage="This project is waiting for approval!"
                        />
                      </p>
                      <button
                        className={styles.rejectBtn}
                        onClick={() => handleApproveProject(false)}
                      >
                        <FormattedMessage
                          id="rejectProject"
                          defaultMessage="Reject Project"
                        />
                      </button>
                      <button
                        className={styles.approvalBtn}
                        onClick={() => handleApproveProject(true)}
                      >
                        <FormattedMessage
                          id="approveProject"
                          defaultMessage="Approve Project"
                        />
                      </button>
                    </div>
                  </>
                )}
              </div>
              <div className={styles.btns}></div>{" "}
              {/*  //This div is empty just to make a ghost effect */}
            </div>
          </div>
          <div className={styles.basicInfo}>
            <div className={styles.firstSeccion}>
              <div className={styles.formContainer}>
                <ProjectBasicInfo
                  projectInfo={projectInfo}
                  laboratories={laboratories}
                  setProjectInfo={setProjectInfo}
                  isEditing={isEditing}
                  updateProjectInfo={handleUpdateProjectInfo}
                />
              </div>
            </div>
          </div>
          <div className={styles.secondSeccion}>
            <div className={styles.attributesContainer}>
              <AttributeEditor
                className={styles.attribute}
                title="users"
                editMode={isEditing}
                mainEntity={"project"}
                creationMode={false}
                projectId={id}
                createdBy={projectInfo.createdBy}
                projectState= {projectInfo.state}
              />
              <AttributeEditor
                className={styles.attribute}
                title="skills"
                editMode={isEditing}
                mainEntity={"project"}
                creationMode={false}
                projectId={id}
              />
              <AttributeEditor
                className={styles.attribute}
                title="keywords"
                editMode={isEditing}
                mainEntity={"project"}
                creationMode={false}
                projectId={id}
              />
              <AttributeEditor
                className={styles.attribute}
                title="assets"
                editMode={isEditing}
                mainEntity={"project"}
                creationMode={false}
                projectId={id}
              />
            </div>
            <div className={styles.attributesContainer}>
              {canSeeAndEditProjectPlanning &&
               <LogsList id={id} />}
            </div>
            <div className={styles.chatButtonContainer}>
              {canSeeAndEditProjectPlanning && (
                <button
                  onClick={handleOpenGroupChat}
                  className={styles.chatButton}
                >
                  <FaComments className={styles.chatButtonIcon} />
                  Project Chat
                </button>
              )}
            </div>
            <GroupChatModal
              selectedChatProject={selectedChatProject}
              setSelectedChatProject={setSelectedChatProject}
              isGroupChatModalOpen={isGroupChatModalOpen}
              setGroupChatModalOpen={setGroupChatModalOpen}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default ProjectPage;
