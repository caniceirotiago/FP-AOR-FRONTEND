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
import usePlanningPageStore from "../../stores/usePlanningPageStore";


const ProjectPage = () => {
  const navigate = useNavigate();
  const { setSelectedProjectId } = useProjectStore();
  const [isApprovalModalOpen, setIsApprovalModalOpen] = useState(false);
  const [approveOrReject, setApproveOrReject] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const { id } = useParams();
  const [isTheProjectNotExistant, setIsTheProjectNotExistant] = useState(false);
  const { states, fetchProjectStates } = useProjectStatesStore();
  const { fetchProjectRoles } = useProjectRolesStore();
  const { laboratories, fetchLaboratories } = useLabStore();
  const {isThePlanEditable} = usePlanningPageStore();

  const [projectInfo, setProjectInfo] = useState({
    name: "",
    description: "",
    motivation: "",
    state: "",
    laboratory: "",
    keywords: [],
    skills: [],
    users: [],
    assets: [],
  });

  const {isGroupChatModalOpen, setGroupChatModalOpen, selectedChatProject, setSelectedChatProject} = useGroupChatModalStore();

  const intl = useIntl();

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
      laboratoryId: projectInfo.laboratory.id,
      conclusionDate: projectInfo.conclusionDate
        ? new Date(projectInfo.conclusionDate).toISOString()
        : null,
    };
    try {
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
        user.role === "PROJECT_MANAGER" &&
        user.accepted
    );
  const canSeeAndEditProjectPlanning =
    projectInfo.members &&
    projectInfo.members.some(
      (user) =>
        user.userId === parseInt(localStorage.getItem("userId")) &&
        user.accepted
    );

  const isInApprovalMode =
    localStorage.getItem("role") === "1" && projectInfo.state === "READY";

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
            approveOrReject = {approveOrReject}
            projectId={projectInfo.id}
          />
          <div className={styles.controlPanel}>
            <div className={styles.btns}>
              {canEdit &&
                projectInfo.state !== "FINISHED" &&
                projectInfo.state !== "CANCELLED" && (
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
          <div className={styles.basicInfo}>
            <section className={styles.projectHeader}>
              <h1>{projectInfo.name}</h1>
            </section>
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
              {canSeeAndEditProjectPlanning && (
                <div>
                  <button
                    onClick={() => handleClickToOpenProjectPlanningPage()}
                  >
                    <FormattedMessage
                      id="projectPlanning"
                      defaultMessage="Project Planning"
                    />
                  </button>
                </div>
              )}
              <div className={styles.usersContainer}>
                <AttributeEditor
                  title="users"
                  editMode={isEditing}
                  mainEntity={"project"}
                  creationMode={false}
                  projectId={id}
                  createdBy={projectInfo.createdBy}
                />
              </div>
            </div>
          </div>
          <div className={styles.secondSeccion}>
            <div className={styles.attributesContainer}>
              <AttributeEditor
                title="skills"
                editMode={isEditing}
                mainEntity={"project"}
                creationMode={false}
                projectId={id}
              />
              <AttributeEditor
                title="keywords"
                editMode={isEditing}
                mainEntity={"project"}
                creationMode={false}
                projectId={id}
              />
              <AttributeEditor
                title="assets"
                editMode={isEditing}
                mainEntity={"project"}
                creationMode={false}
                projectId={id}
              />
            </div>
            <div className={styles.attributesContainer}>
              {canSeeAndEditProjectPlanning && <LogsList id={id} />}
            </div>
            <div className={styles.chatButtonContainer}>
              {canSeeAndEditProjectPlanning && (
                <button
                  onClick={handleOpenGroupChat}
                  className={styles.chatButton}
                >
                  Open Group Chat
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
