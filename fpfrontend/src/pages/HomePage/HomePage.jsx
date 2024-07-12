import React, { useEffect, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
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
import { FaTable, FaTh, FaPlus, FaFilter, FaCheckSquare, FaSquare } from "react-icons/fa";
import useAuthStore from "../../stores/useAuthStore.jsx";
import useDeviceStore from "../../stores/useDeviceStore.jsx";
import useLayoutStore from "../../stores/useLayoutStore.jsx";

const HomePage = () => {
  const { dimensions, deviceType } = useDeviceStore();
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { selectedView, setSelectedView } = useLayoutStore();
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
    showMyProjectsOnly: "", 
  };
  const [filters, setFilters] = useState(defaultFilters);
  const { states, fetchProjectStates } = useProjectStatesStore();
  const [filterType, setFilterType] = useState("name");
  const intl = useIntl();

  function getInitialPageSize() {
    const width = dimensions.width;
    if (width < 600) {
      return 5;
    } else if (width < 1200 && width >= 600) {
      return 6;
    } else if (width < 1600 && width >= 1200) {
      return 10;
    } else if (width >= 1600) {
      return 20;
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
    } else if (width < 1600 && width >= 1200) {
      newPageSize = 10;
    } else if (width >= 1600) {
      newPageSize = 20;
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
  }, [selectedView, view, dimensions.width]);

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
    if (isAuthenticated) navigate("/authenticatedhomepage");
    else navigate("/homepage");
    const fetchProjects = async () => {
      console.log("fetching projects");
      console.log(filters);
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

  const handleToggleMyProjects = () => {
    setFilters({
      ...filters,
      showMyProjectsOnly: filters.showMyProjectsOnly ? "" : localStorage.getItem("userId"), 
    });
  };

  const handleClick = () => {
    setIsModalOpen(true);
  };

  const handleClearFilters = () => {
    setFilters(defaultFilters);
    setFilterType("name"); 
    setPageSize(getInitialPageSize());
    setPageNumber(1);

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

  const buttonText =
    view === "table"
      ? intl.formatMessage({ id: "cardsButtonText" })
      : intl.formatMessage({ id: "tableButtonText" });

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
              data-text={intl.formatMessage({ id: "createButtonText" })}
            >
              <FaPlus className={styles.svgIcon} />
            </button>
          </ProtectedComponents>
          {isAuthenticated && deviceType === "desktop" && (
            <div className={styles.viewToggle}>
              <button
                onClick={toggleView}
                className={styles.iconButton}
                data-text={buttonText}
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
            data-text={intl.formatMessage({ id: "filterButtonText" })}
          >
            <FaFilter className={styles.svgIcon} />
          </button>
        </div>
        {filtersVisible && (
          <div className={styles.filters}>
            <select value={filterType} onChange={handleFilterTypeChange}>
              <option value="name">
                <FormattedMessage id="filterByName" defaultMessage="Name" />
              </option>
              <option value="keywords">
                <FormattedMessage id="keywords" defaultMessage="Keywords" />
              </option>
              <option value="skills">
                <FormattedMessage id="skills" defaultMessage="Skills" />
              </option>
            </select>
            <input
              name={filterType}
              placeholder={intl.formatMessage(
                { id: "filterPlaceholder" },
                {
                  type: intl.formatMessage({ id: filterType }),
                }
              )}
              value={filters[filterType]}
              onChange={handleFilterChange}
            />
            <select
              name="state"
              value={filters.state}
              onChange={handleFilterChange}
            >
              <option value="">
                <FormattedMessage
                  id="selectState"
                  defaultMessage="Select State"
                />
              </option>
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
              <option value="">
                <FormattedMessage
                  id="selectLaboratory"
                  defaultMessage="Select Laboratory"
                />
              </option>
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
              <option value="">
                <FormattedMessage id="sortBy" defaultMessage="Sort By" />
              </option>
              <option value="creationDate">
                {" "}
                <FormattedMessage
                  id="tableHeaderCreationDate"
                  defaultMessage="Creation Date"
                />
              </option>
              <option value="openPositions">
                <FormattedMessage
                  id="openPositions"
                  defaultMessage="Open Positions"
                />
              </option>
              <option value="state">
                <FormattedMessage
                  id="tableHeaderState"
                  defaultMessage="State"
                />
              </option>
            </select>
            <select
              name="orderBy"
              value={filters.orderBy}
              onChange={handleOrderChange}
            >
              <option value="">
                <FormattedMessage id="orderBy" defaultMessage="Order By" />
              </option>
              <option value="asc">
                <FormattedMessage
                  id="orderByAscending"
                  defaultMessage="Ascending"
                />
              </option>
              <option value="desc">
                <FormattedMessage
                  id="orderByDescending"
                  defaultMessage="Descending"
                />
              </option>
            </select>
            {isAuthenticated && (
              <div className={styles.myProjects}>
                 <h5 className={styles.myProjectH5}>
                        <FormattedMessage id="myProjectsTitle" defaultMessage="My Projects" />
                    </h5>
                <label className={styles.switch}>
                  <input
                    type="checkbox"
                    checked={!!filters.showMyProjectsOnly}
                    onChange={handleToggleMyProjects}
                  />
                  <span className={styles.slider}></span>
                </label></div>)}
            <button onClick={handleClearFilters} className={styles.clearFiltersBtn}>
              {" "}
              <FormattedMessage
                id="clearFilters"
                defaultMessage="Clear Filters"
              />
            </button>
          </div>
        )}
      </div>
      <div className={styles.projectsPanel}>
        {view === "table" && deviceType === "desktop" ? (
          <ProjectTable
            projects={projects}
            pageCount={pageCount}
            setPageNumber={setPageNumber}
          />
        ) : (
          <ProjectCards projects={projects} isAuthenticated={isAuthenticated} />
        )}
        {pageCount > 1 && (
          <div className={styles.pagination}>
            <button
              onClick={() => setPageNumber(1)}
              disabled={pageNumber === 1}
            >
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
              <FormattedMessage id="pageInfo" defaultMessage="Page" />{" "}
              <strong>
                {pageNumber}
                <FormattedMessage id="ofInfo" defaultMessage="of" /> {pageCount}
              </strong>
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
