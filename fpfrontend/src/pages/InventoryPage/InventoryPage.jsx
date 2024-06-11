import React, { useEffect, useState } from "react";
import styles from "./InventoryPage.module.css";
import { useNavigate, useLocation } from "react-router-dom";
import AssetTable from "../../components/InventoryComponents/AssetsTable/AssetTable.jsx";
import CreateAssetModal from "../../components/InventoryComponents/AssetsModal/CreateAssetModal.jsx";
import assetService from "../../services/assetService";
import { FaTable, FaTh, FaPlus, FaFilter } from "react-icons/fa";
import useAuthStore from "../../stores/useAuthStore.jsx";
import useDeviceStore from "../../stores/useDeviceStore.jsx";
import useAssetTypeStore from "../../stores/useAssetTypeStore.jsx";

const InventoryPage = () => {
  const { dimensions } = useDeviceStore();
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [assets, setAssets] = useState([]);
  const [pageSize, setPageSize] = useState(getInitialPageSize());
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [filters, setFilters] = useState({
    name: "",
    state: "",
    projectKeywords: "",
    projectSkills: "",
    sortBy: "",
    laboratory: "",
  });
  const [pageCount, setPageCount] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const defaultFilters = {
    name: "",
    state: "",
    projectKeywords: "",
    projectSkills: "",
    sortBy: "",
    laboratory: "",
  };
  const [filterType, setFilterType] = useState("name");
  const { types, fetchAssetTypes } = useAssetTypeStore();

  function getInitialPageSize() {
    const width = dimensions.width;
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
    const width = dimensions.width;
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
    // Additional logic for resizing if needed
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
  }, [dimensions.width]);

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
    fetchAssetTypes();
  }, [location.search]);

  useEffect(() => {
    const fetchAssets = async () => {
      const response = await assetService.getAllAssets();
      if (response.ok) {
        const data = await response.json();
        setAssets(data);
      } else {
        console.error("Error fetching assets:", response.status);
      }
    };
    fetchAssets();
  }, [pageNumber, filters]);

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

  const handleFilterTypeChange = (e) => {
    setFilterType(e.target.value);
  };

  const handleClick = () => {
    setIsModalOpen(true);
  };

  const handleClearFilters = () => {
    setFilters(defaultFilters);
    if (isAuthenticated) navigate("/authenticatedhomepage");
    else navigate("/homepage");
  };

  const toggleFiltersVisibility = () => {
    setFiltersVisible(!filtersVisible);
  };

  return (
    <div className={styles.inventoryPage}>
      <div className={styles.controlPanel}>
        <div className={styles.btns}>
          <CreateAssetModal
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
              {/* Add other filter options here */}
            </select>
            {/* Add filter inputs here */}
          </div>
        )}
      </div>
      <AssetTable assets={assets} pageCount={pageCount} setPageNumber={setPageNumber} />
    </div>
  );
};

export default InventoryPage;

