import React, {useEffect, useState} from 'react';
import styles from './HomePage.module.css';
import ProjectTable from '../../components/HomePageComponents/ProjectTable/ProjectTable.jsx';
import ProtectedComponents from '../../components/auth regist/ProtectedComponents';
import CreateProjectModal from '../../components/modals/CreateProjectModal.jsx';
import projectService from '../../services/projectService';
import ProjectCards from '../../components/HomePageComponents/ProjectCards/ProjectCards.jsx';

const HomePage = () => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const [projects, setProjects] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(5); 
  const [pageCount, setPageCount] = useState(0);
  const [filters, setFilters] = useState({
    name: '',
    state: '',
    projectKeywords: '',
    projectSkills: '',
    sortBy: ''
  });
  const [view, setView] = useState('table');

  useEffect(() => {
      const fetchProjects = async () => {
          const response = await projectService.getFilteredProjects(pageNumber, pageSize, filters);
          if (response.status === 200) {
              const data = await response.json();
              setProjects(data.
                projectsForAPage
                );
              setPageCount(Math.ceil(data.totalProjects / pageSize));
          }
      }
      fetchProjects();
  }, [isModalOpen, pageNumber, pageSize, filters]);

  const handleClick = () => {
    setIsModalOpen(true);
  }
  console.log(projects)
  return (
    <div className={styles.homePage} >
      <ProtectedComponents>
        <CreateProjectModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        <button onClick={handleClick}>Create Project</button>
      </ProtectedComponents>
      <div className={styles.viewToggle}>
        <button onClick={() => setView('table')}>Table View</button>
        <button onClick={() => setView('cards')}>Card View</button>
      </div>
      {view === 'table' ? (
        <ProjectTable
          projects={projects}
          pageCount={pageCount}
          filters={filters}
          setFilters={setFilters}
          pageSize={pageSize}
          setPageSize={setPageSize}
          setPageNumber={setPageNumber}
          pageNumber={pageNumber}
        />
      ) : (
        <ProjectCards
          pageNumber={pageNumber}
          projects={projects}
          pageCount={pageCount}
          filters={filters}
          setFilters={setFilters}
          pageSize={pageSize}
          setPageSize={setPageSize}
          setPageNumber={setPageNumber}
        />
      )}
    </div>
  );
};

export default HomePage;
