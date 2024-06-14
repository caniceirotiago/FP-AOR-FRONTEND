import React, { useEffect, useState } from "react";
import styles from "./HomePage.module.css";
import ProjectTable from "../../components/HomePageComponents/ProjectTable/ProjectTable.jsx";
import ProtectedComponents from "../../components/auth regist/ProtectedComponents";
import CreateProjectModal from "../../components/modals/CreateProjectModal.jsx";
import projectService from "../../services/projectService";
import ProjectCards from "../../components/HomePageComponents/ProjectCards/ProjectCards.jsx";
import useTableCardView from "../../stores/useTableCardView.jsx";
import useLabStore from "../../stores/useLabStore.jsx";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router";
import useProjectStatesStore from "../../stores/useProjectStatesStore.jsx";
import { FaTable, FaTh, FaPlus, FaFilter } from "react-icons/fa";
import useAuthStore from "../../stores/useAuthStore.jsx";
import useDeviceStore from "../../stores/useDeviceStore.jsx";

const HomePage = () => {
  const { dimensions, deviceType } = useDeviceStore();
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedView, setSelectedView] = useState("table");
  const { view, setView } = useTableCardView();
  const [projects, setProjects] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(getInitialPageSize());
  const [pageCount, setPageCount] = useState(1);
  const { laboratories, fetchLaboratories } = useLabStore();
  const location = useLocation();
  const [filtersVisible, setFiltersVisible] = useState(false);
  const defaultFilters = {
    name: "",
    state: "",
    projectKeywords: "",
    projectSkills: "",
    sortBy: "",
    orderBy: "",
    laboratory: "",
  };
  const [filters, setFilters] = useState({
    defaultFilters,
  });
  const { states, fetchProjectStates } = useProjectStatesStore();
  const [filterType, setFilterType] = useState("name");

  function getInitialPageSize() {
    const width = dimensions.width;
    if (width < 600) {
      return 5;
    } else if (width < 1200 && width >= 600) {
      return 6;
    } else if (width >= 1200) {
      return 8;
    }
    return 5;
  }

  const updatePageSize = () => {
    const width = dimensions.width;
    let newPageSize;

    if (width < 600) {
      newPageSize = 5;
    } else if (width < 1200 && width >= 600) {
      newPageSize = 6;
    } else if (width >= 1200) {
      newPageSize = 8;
    }
    setPageSize(newPageSize);
  };

  const handleResize = () => {
    if (deviceType === "mobile") {
      if (view !== "cards") {
        setView("cards");
      }
    } else {
      if (selectedView === "table" && view !== "table" && isAuthenticated) {
        setView("table");
      }
    }
  };

  useEffect(() => {
    updatePageSize();
    handleResize();
    window.addEventListener("resize", handleResize);
    window.addEventListener("resize", updatePageSize);
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("resize", updatePageSize);
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
      const response = await projectService.getFilteredProjects(
        pageNumber,
        pageSize,
        filters
      );
      if (response.status === 200) {
        const data = await response.json();
        setProjects(data.projectsForAPage);
        const totalProjects = data.totalProjects;
        const newPageCount = Math.ceil(totalProjects / pageSize) || 1; // Ensure pageCount is at least 1
        setPageCount(newPageCount);
        // Validate and adjust the pageNumber if it exceeds pageCount
        if (pageNumber > newPageCount) {
          setPageNumber(newPageCount);
        }
      }
    };
    if (!isAuthenticated) setView("cards");
    fetchProjects();
    fetchLaboratories();
  }, [isModalOpen, pageNumber, pageSize, filters]);

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const handleSortChange = (e) => {
    setFilters({
      ...filters,
      sortBy: e.target.value,
    });
  };

  const handleOrderChange = (e) => {
    setFilters({
      ...filters,
      orderBy: e.target.value,
    });
  };

  const handleFilterTypeChange = (e) => {
    setFilterType(e.target.value);
  };

  const handleClick = () => {
    setIsModalOpen(true);
  };

  const handleClearFilters = () => {
    setFilters(defaultFilters);
    setFilterType("name"); // Reset filter type to default
    setPageSize(getInitialPageSize());
    setPageNumber(1);
    if (isAuthenticated) navigate("/authenticatedhomepage");
    else navigate("/homepage");
  };

  const toggleView = () => {
    if (selectedView === "table") {
      setSelectedView("cards");
      setView("cards");
    } else {
      setSelectedView("table");
      setView("table");
    }
  };

  const toggleFiltersVisibility = () => {
    setFiltersVisible(!filtersVisible);
  };

  return (
    <div className={styles.homePage}>
      <div className={styles.controlPanel}>
        <div className={styles.btns}>
          <ProtectedComponents>
            <CreateProjectModal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
            />
            <button
              onClick={handleClick}
              className={`${styles.iconButton} ${styles.createButton}`}
              data-text="Create"
            >
              <FaPlus className={styles.svgIcon} />
            </button>
          </ProtectedComponents>
          {isAuthenticated && deviceType === "desktop" && (
            <div className={styles.viewToggle}>
              <button
                onClick={toggleView}
                className={styles.iconButton}
                data-text={view === "table" ? "Cards" : "Table"}
              >
                {view === "table" ? (
                  <FaTh className={styles.svgIcon} />
                ) : (
                  <FaTable className={styles.svgIcon} />
                )}
              </button>
            </div>
          )}
          <button
            onClick={toggleFiltersVisibility}
            className={styles.iconButton}
            data-text="Filter"
          >
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
              placeholder={
                filterType.charAt(0).toUpperCase() + filterType.slice(1)
              }
              value={filters[filterType]}
              onChange={handleFilterChange}
            />
            <select
              name="state"
              value={filters.state}
              onChange={handleFilterChange}
            >
              <option value="">Select State</option>
              {states.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
            <select
              name="laboratory"
              value={filters.laboratory}
              onChange={handleFilterChange}
            >
              <option value="">Select Laboratory</option>
              {laboratories.map((lab) => (
                <option key={lab.id} value={lab.id}>
                  {lab.location}
                </option>
              ))}
            </select>
            <select
              name="sortBy"
              value={filters.sortBy}
              onChange={handleSortChange}
            >
              <option value="">Sort By</option>
              <option value="creationDate">Creation Date</option>
              <option value="openPositions">Open Positions</option>
              <option value="state">State</option>
            </select>
            <select
              name="orderBy"
              value={filters.orderBy}
              onChange={handleOrderChange}
            >
              <option value="">Order By</option>
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
            <button onClick={handleClearFilters}>Clear Filters</button>
          </div>
        )}
      </div>
      <div className={styles.projectsPanel}>
        {view === "table" && deviceType === "desktop" ? (
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
            {"<<"}
          </button>
          <button
            onClick={() => setPageNumber(pageNumber - 1)}
            disabled={pageNumber === 1}
          >
            {"<"}
          </button>
          <button
            onClick={() => setPageNumber(pageNumber + 1)}
            disabled={pageNumber === pageCount}
          >
            {">"}
          </button>
          <button
            onClick={() => setPageNumber(pageCount)}
            disabled={pageNumber === pageCount}
          >
            {">>"}
          </button>
          <span>
            Page{" "}
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
