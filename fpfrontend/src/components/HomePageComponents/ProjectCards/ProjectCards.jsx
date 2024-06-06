import React from 'react';
import styles from './ProjectCards.module.css';
import { useNavigate } from 'react-router';

function ProjectCards({ projects, pageCount, filters, setFilters, pageSize, setPageSize, pageNumber, setPageNumber }) {
  const navigate = useNavigate();

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

  const handleClickToOpenProjectPage = (projectId) => () => {
    navigate(`/projectpage/${projectId}`);
  };

  return (
    <>
      <div className={styles.filters}>
        <input name="name" placeholder="Name" onChange={handleFilterChange} />
        <input name="state" placeholder="State" onChange={handleFilterChange} />
        <input name="keywords" placeholder="Keywords" onChange={handleFilterChange} />
        <input name="skills" placeholder="Skills" onChange={handleFilterChange} />
        <select name="sortBy" onChange={handleSortChange}>
          <option value="">Sort By</option>
          <option value="creationDate">Creation Date</option>
          <option value="openPositions">Open Positions</option>
          <option value="state">State</option>
        </select>
      </div>
      <div className={styles.cardContainer}>
        {projects.map(project => (
          <div key={project.id} className={styles.card}>
            <h2>{project.name}</h2>
            <p>{project.description}</p>
            <p><strong>State:</strong> {project.state}</p>
            <p><strong>Creation Date:</strong> {project.creationDate}</p>
            <p><strong>Number of Members:</strong> {project.members.length}</p>
            <button onClick={handleClickToOpenProjectPage(project.id)}>Project Page</button>
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
    </>
  );
}

export default ProjectCards;
