import React, { useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";
import styles from "./ProjectCards.module.css";
import { useNavigate } from "react-router";
import useConfigurationStore from "../../../stores/useConfigurationStore";
import useLoginModalStore from "../../../stores/useLoginModalStore";
import useProjectStore from "../../../stores/useProjectStore";
import { FaChartGantt } from "react-icons/fa6";
import {stateColors, stateColorsBriefcaseBackground} from "../../../utils/colors/projectColors";


function ProjectCards({ projects, isAuthenticated }) {
  const navigate = useNavigate();
  const { setSelectedProjectId } = useProjectStore();
  const { configurations, fetchConfigurations } = useConfigurationStore();
  const [maxProjectMembers, setMaxProjectMembers] = useState(null);
  const { setIsLoginModalOpen } = useLoginModalStore();

  useEffect(() => {
    fetchConfigurations();
  }, [fetchConfigurations]);

  useEffect(() => {
    if (configurations.has("maxProjectMembers")) {
      setMaxProjectMembers(
        parseInt(configurations.get("maxProjectMembers"), 10)
      );
    }
  }, [configurations]);

  const handleClickToOpenProjectPage = (projectId) => () => {
    if (isAuthenticated) navigate(`/projectpage/${projectId}`);
    else setIsLoginModalOpen(true);
  };
  const handleClickToOpenProjectPlanningPage = (e, projectId) => {
    e.stopPropagation();
    if (isAuthenticated) {
      setSelectedProjectId(projectId);
      navigate(`/projectplanning`);
    }
  };
  const handleUserPhotoClick = (e, member) => {
    if (isAuthenticated) {
      e.stopPropagation();
      navigate(`/userprofile/${member.user.username}`);
    }
  };

  const renderMemberThumbnails = (members) => {
    const memberThumbnails = members
      .slice(0, 3)
      .map((member) => (
        <img
          key={member.id}
          src={member.user.photo || "default-thumbnail.png"}
          alt={member.user.username}
          className={styles.thumbnail}
          onClick={(e) => handleUserPhotoClick(e, member)}
        />
      ));

    if (members.length > 3) {
      memberThumbnails.push(
        <span key="more" className={styles.moreMembers}>
          +{members.length - 3}
        </span>
      );
    }

    return memberThumbnails;
  };

  const canSeeAndEditProjectPlanning = (project) => {
    return project?.members?.some(
      (user) =>
        user.userId === parseInt(localStorage.getItem("userId")) &&
        user.accepted
    );
  };

  return (
    <div className={styles.mainContainer}>
      <div className={styles.cardContainer}>
        {projects.map((project) => (
          <div
            key={project.id}
            className={styles.card}
            onClick={handleClickToOpenProjectPage(project.id)}
          >
            <div
              className={styles.statusIndicator}
              style={{ backgroundColor: stateColors[project.state] }}
            ></div>
            {maxProjectMembers &&
              project.members.length < maxProjectMembers && (
                <div className={styles.vacancyIndicator}>
                  <FormattedMessage
                    id="openSlots"
                    defaultMessage="{slots} open slots"
                    values={{
                      slots: maxProjectMembers - project.members.length,
                    }}
                  />
                </div>
              )}
            <div
              className={styles.topSection}
              style={{
                backgroundImage: stateColorsBriefcaseBackground[project.state],
              }}
            >
              <div className={styles.border}></div>
              <div className={styles.thumbnails} >
                {(canSeeAndEditProjectPlanning(project) && isAuthenticated) && 
                <div className={styles.projectPlaningBtn} onClick={(e) =>handleClickToOpenProjectPlanningPage(e, project.id)}><FaChartGantt/> </div>}
                {renderMemberThumbnails(project.members)}
              </div>
            </div>
            <div className={styles.bottomSection}>
              <span className={styles.title}>{project.name}</span>
              <div className={styles.row}>
                <div className={styles.item}>
                  <span className={styles.bigText}>
                    {project.members.length}
                  </span>
                  <span className={styles.regularText}>
                    <FormattedMessage
                      id="members"
                      defaultMessage="Members"
                    />
                  </span>
                </div>
                <div className={styles.item}>
                  <span className={styles.bigText}>
                    {project.createdBy.username}
                  </span>
                  <span className={styles.regularText}>
                    <FormattedMessage
                      id="tableHeaderCreatedBy"
                      defaultMessage="Created By"
                    />
                  </span>
                </div>
                <div className={styles.item} style={project.state === "READY" ? { backgroundColor: "var(--ready-state-aux-color)", borderRadius: "15px" } : {}}>
                  <span className={styles.bigText}>{project.state}</span>
                  <span className={styles.regularText}>
                    <FormattedMessage
                      id="tableHeaderState"
                      defaultMessage="State"
                    />
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProjectCards;
