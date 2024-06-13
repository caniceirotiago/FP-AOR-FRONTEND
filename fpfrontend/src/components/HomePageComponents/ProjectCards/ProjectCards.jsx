import React, { useEffect, useState } from 'react';
import styles from './ProjectCards.module.css';
import { useNavigate } from 'react-router';
import useConfigurationStore from '../../../stores/useConfigurationStore';
import useLoginModalStore from '../../../stores/useLoginModalStore';
import useProjectStore from '../../../stores/useProjectStore';

const stateColors = {
  PLANNING: 'var(--color-planning)',
  READY: 'var(--color-ready)',
  IN_PROGRESS: 'var(--color-in-progress)',
  FINISHED: 'var(--color-finished)',
  CANCELLED: 'var(--color-cancelled)'
};

function ProjectCards({ projects, pageCount, filters, setFilters, pageSize, setPageSize, pageNumber, setPageNumber, isAuthenticated, labs }) {
  const navigate = useNavigate();
  const {setSelectedProjectId} = useProjectStore();
  const { configurations, fetchConfigurations } = useConfigurationStore();
  const [maxProjectMembers, setMaxProjectMembers] = useState(null);
  const {setIsLoginModalOpen} = useLoginModalStore();

  useEffect(() => {

    fetchConfigurations();
  }, [fetchConfigurations]);

  useEffect(() => {
    if (configurations.has('maxProjectMembers')) {
      setMaxProjectMembers(parseInt(configurations.get('maxProjectMembers'), 10));
    }
  }, [configurations]);



  const handleClickToOpenProjectPage = (projectId) => () => {
    if(isAuthenticated)navigate(`/projectpage/${projectId}`);
    else setIsLoginModalOpen(true);
  };
  const handleClickToOpenProjectPlanningPage = (e, projectId) => {
    e.stopPropagation();
   if(isAuthenticated){
    setSelectedProjectId(projectId);
    navigate(`/projectplanning`);
   } 
  };


  const renderMemberThumbnails = (members) => {
    const memberThumbnails = members.slice(0, 3).map(member => (
      <img key={member.id} src={member.user.photo || 'default-thumbnail.png'} alt={member.user.username} className={styles.thumbnail} />
    ));

    if (members.length > 3) {
      memberThumbnails.push(
        <span key="more" className={styles.moreMembers}>+{members.length - 3}</span>
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
}

  return (
    <div className={styles.mainContainer}>
     
      <div className={styles.cardContainer}>
        {projects.map(project => (
          <div key={project.id} className={styles.card} onClick={handleClickToOpenProjectPage(project.id)}>
            <div className={styles.statusIndicator} style={{ backgroundColor: stateColors[project.state] }}></div>
            {maxProjectMembers && project.members.length < maxProjectMembers && (
              <div className={styles.vacancyIndicator}>
                {maxProjectMembers - project.members.length} open slots
              </div>
            )}
            <div className={styles.topSection}>
              <div className={styles.border}></div>
              <div className={styles.thumbnails}>
                {canSeeAndEditProjectPlanning(project) && 
                <button onClick={(e) =>handleClickToOpenProjectPlanningPage(e, project.id)}>Plan</button>}
                {renderMemberThumbnails(project.members)}
              </div>
            </div>
            <div className={styles.bottomSection}>
              <span className={styles.title}>{project.name}</span>
              <div className={styles.row}>
                <div className={styles.item}>
                  <span className={styles.bigText}>{project.members.length}</span>
                  <span className={styles.regularText}>Members</span>
                </div>
                <div className={styles.item}>
                  <span className={styles.bigText}>{project.createdBy.username}</span>
                  <span className={styles.regularText}>Created By</span>
                </div>
                <div className={styles.item}>
                  <span className={styles.bigText}>{project.state}</span>
                  <span className={styles.regularText}>State</span>
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
