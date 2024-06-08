import React, { useEffect, useState } from 'react';
import styles from './HomePage.module.css';
import ProjectTable from '../../components/HomePageComponents/ProjectTable/ProjectTable.jsx';
import ProtectedComponents from '../../components/auth regist/ProtectedComponents';
import CreateProjectModal from '../../components/modals/CreateProjectModal.jsx';
import projectService from '../../services/projectService';
import ProjectCards from '../../components/HomePageComponents/ProjectCards/ProjectCards.jsx';
import useTableCardView from '../../stores/useTableCardView.jsx';
import useLabStore from '../../stores/useLabStore.jsx';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router';
import useProjectStatesStore from '../../stores/useProjectStatesStore.jsx';
import { FaTable, FaTh, FaPlus, FaFilter } from 'react-icons/fa';
import useAuthStore from '../../stores/useAuthStore.jsx';

const HomePage = () => {
  const {isAuthenticated} = useAuthStore();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedView, setSelectedView] = useState('table');
  const { view, setView } = useTableCardView();
  const [projects, setProjects] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(getInitialPageSize());
  const [pageCount, setPageCount] = useState(0);
  const { laboratories, fetchLaboratories } = useLabStore();
  const location = useLocation();
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [filters, setFilters] = useState({
    name: '',
    state: '',
    projectKeywords: '',
    projectSkills: '',
    sortBy: '',
    laboratory: ''
  });
  const defaultFilters = {
    name: '',
    state: '',
    projectKeywords: '',
    projectSkills: '',
    sortBy: '',
    laboratory: ''
  };
  const { states, fetchProjectStates } = useProjectStatesStore();
  const [filterType, setFilterType] = useState('name');
  

  function getInitialPageSize() {
    const width = window.innerWidth;
    if (width < 600) {
      return 5;
    } else if (width < 1200 && width >= 600) {
      return 7;
    } else if (width >= 1200) {
      return 15;
    }
    return 5;
  }

  const updatePageSize = () => {
    const width = window.innerWidth;
    let newPageSize;

    if (width < 600) {
      newPageSize = 5;
    } else if (width < 1200 && width >= 600) {
      newPageSize = 7;
    } else if (width >= 1200) {
      newPageSize = 15;
    }

    setPageSize(newPageSize);
  };

  const handleResize = () => {
    const width = window.innerWidth;
    console.log("Handle resize:", width, selectedView, view);

    if (width < 768) {
      if (view !== 'cards') {
        setView('cards');
      }
    } else {
      if (selectedView === 'table' && view !== 'table' && isAuthenticated) {
        setView('table');
      }
    }
  };

  useEffect(() => {
    updatePageSize();
    handleResize();
    window.addEventListener('resize', handleResize);
    window.addEventListener('resize', updatePageSize);
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('resize', updatePageSize);
    };
  }, [selectedView, view]);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const newFilters = {};
    
    searchParams.forEach((value, key) => {
      newFilters[key] = value;
    });

    setFilters((prevFilters) => ({
      ...prevFilters,
      ...newFilters,
    }));
    fetchProjectStates();
  }, [location.search]);

  useEffect(() => {
    const fetchProjects = async () => {
      const response = await projectService.getFilteredProjects(pageNumber, pageSize, filters);
      if (response.status === 200) {
        const data = await response.json();
        setProjects(data.projectsForAPage);
        setPageCount(Math.ceil(data.totalProjects / pageSize));
      }
    };
    if (!isAuthenticated) setView('cards');
    fetchProjects();
    fetchLaboratories();
  }, [isModalOpen, pageNumber, pageSize, filters]);

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
  };

  const handleClick = () => {
    setIsModalOpen(true);
  }

  const handleClearFilters = () => {
    setFilters(defaultFilters);
    if (isAuthenticated) navigate('/authenticatedhomepage');
    else navigate('/homepage');
  };

  const toggleView = () => {
    if (selectedView === 'table') {
      setSelectedView('cards');
      setView('cards');
    } else {
      setSelectedView('table');
      setView('table');
    }
  };

  const toggleFiltersVisibility = () => {
    setFiltersVisible(!filtersVisible);
  };

  const isMobile = window.innerWidth < 768;

  return (
    <div className={styles.homePage}>
      <div className={styles.controlPanel}>
        <div className={styles.btns}>
          <ProtectedComponents>
            <CreateProjectModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
            <button onClick={handleClick} className={`${styles.iconButton} ${styles.createButton}`} data-text="Create">
              <FaPlus className={styles.svgIcon} />
            </button>
          </ProtectedComponents>
          {isAuthenticated && !isMobile && (
            <div className={styles.viewToggle}>
              <button onClick={toggleView} className={styles.iconButton} data-text={view === 'table' ? 'Cards' : 'Table'}>
                {view === 'table' ? <FaTh className={styles.svgIcon} /> : <FaTable className={styles.svgIcon} />}
              </button>
            </div>
          )}
          <button onClick={toggleFiltersVisibility} className={styles.iconButton} data-text="Filter">
            <FaFilter className={styles.svgIcon} />
          </button>
        </div>
        {filtersVisible && (
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
            <select name="laboratory" onChange={handleFilterChange}>
              <option value="">Select Laboratory</option>
              {laboratories.map((lab) => (
                <option key={lab.id} value={lab.id}>{lab.location}</option>
              ))}
            </select>
            <select name="sortBy" onChange={handleSortChange}>
              <option value="">Sort By</option>
              <option value="creationDate">Creation Date</option>
              <option value="openPositions">Open Positions</option>
              <option value="state">State</option>
            </select>
            <button onClick={handleClearFilters}>Clear Filters</button>
          </div>
        )}
      </div>
      <div className={styles.projectsPanel}>
        {view === 'table' && !isMobile ? (
          <ProjectTable
            projects={projects}
            pageCount={pageCount}
            filters={filters}
            setFilters={setFilters}
            pageSize={pageSize}
            setPageSize={setPageSize}
            setPageNumber={setPageNumber}
            pageNumber={pageNumber}
            labs={laboratories}
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
            isAuthenticated={isAuthenticated}
            labs={laboratories}
          />
        )}
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
    </div>
  );
};

export default HomePage;
