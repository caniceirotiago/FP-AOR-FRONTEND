import React, { useEffect, useState } from 'react';
import styles from './ProjectCards.module.css';
import { useNavigate } from 'react-router';
import useProjectStatesStore from '../../../stores/useProjectStatesStore';

const stateColors = {
  PLANNING: 'var(--color-planning)',
  READY: 'var(--color-ready)',
  IN_PROGRESS: 'var(--color-in-progress)',
  FINISHED: 'var(--color-finished)',
  CANCELLED: 'var(--color-cancelled)'
};

function ProjectCards({ projects, pageCount, filters, setFilters, pageSize, setPageSize, pageNumber, setPageNumber }) {
  const navigate = useNavigate();
  const { states, fetchProjectStates } = useProjectStatesStore();
  const [filterType, setFilterType] = useState('name');

  useEffect(() => {
    fetchProjectStates();
  }, [fetchProjectStates]);

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const handleSortChange = (e) => {
    setFilters({
      ...filters,
      sortBy: e.target.value
    });
  };

  const handleFilterTypeChange = (e) => {
    setFilterType(e.target.value);
    setFilters({
      ...filters,
      [filterType]: ''
    });
  };

  const handleClickToOpenProjectPage = (projectId) => () => {
    navigate(`/projectpage/${projectId}`);
  };

  return (
    <div className={styles.mainContainer}>
      <div className={styles.filters}>
        <select value={filterType} onChange={handleFilterTypeChange}>
          <option value="name">Name</option>
          <option value="keywords">Keywords</option>
          <option value="skills">Skills</option>
        </select>
        <input
          name={filterType}
          placeholder={filterType.charAt(0).toUpperCase() + filterType.slice(1)}
          onChange={handleFilterChange}
        />
        <select name="state" onChange={handleFilterChange}>
          <option value="">Select State</option>
          {states.map((state) => (
            <option key={state} value={state}>{state}</option>
          ))}
        </select>
        <select name="sortBy" onChange={handleSortChange}>
          <option value="">Sort By</option>
          <option value="creationDate">Creation Date</option>
          <option value="openPositions">Open Positions</option>
          <option value="state">State</option>
        </select>
      </div>
      <div className={styles.cardContainer}>
        {projects.map(project => (
          <div key={project.id} className={styles.card} onClick={handleClickToOpenProjectPage(project.id)}>
            <div className={styles.statusIndicator} style={{ backgroundColor: stateColors[project.state] }}></div>
            <div className={styles.topSection}>
              <div className={styles.border}></div>
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
      <div className={styles.pagination}>
        <button onClick={() => setPageNumber(1)} disabled={pageNumber === 1}>
          {'<<'}
        </button>
        <button onClick={() => setPageNumber(pageNumber - 1)} disabled={pageNumber === 1}>
          {'<'}
        </button>
        <button onClick={() => setPageNumber(pageNumber + 1)} disabled={pageNumber === pageCount}>
          {'>'}
        </button>
        <button onClick={() => setPageNumber(pageCount)} disabled={pageNumber === pageCount}>
          {'>>'}
        </button>
        <span>
          Page{' '}
          <strong>
            {pageNumber} of {pageCount}
          </strong>
        </span>
      </div>
    </div>
  );
}

export default ProjectCards;
