import React, { useEffect, useState } from "react";
import styles from "./InventoryPage.module.css";
import { useLocation } from "react-router-dom";
import AssetTable from "../../components/InventoryComponents/AssetsTable/AssetTable.jsx";
import CreateAssetModal from "../../components/InventoryComponents/AssetsModal/CreateAssetModal.jsx";
import assetService from "../../services/assetService";
import { FaPlus, FaFilter } from "react-icons/fa";
import useDeviceStore from "../../stores/useDeviceStore.jsx";
import useAssetsStore from "../../stores/useAssetsStore.jsx";

const InventoryPage = () => {
  const { dimensions } = useDeviceStore();
  const location = useLocation();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [assets, setAssets] = useState([]);
  const { types, fetchAssetTypes, isEditModalOpen } = useAssetsStore();
  const [pageSize, setPageSize] = useState(getInitialPageSize());
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [filters, setFilters] = useState({
    name: "",
    type: "",
    manufacturer: "",
    partNumber: "",
  });
  const [pageCount, setPageCount] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const defaultFilters = {
    name: "",
    type: "",
    manufacturer: "",
    partNumber: "",
    sortBy: "",
    orderBy: "",
  };
   
  const [filterType, setFilterType] = useState("name", "type");

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
  
  const handleClearFilters = () => {
    setFilters(defaultFilters);
    setFilterType("name"); // Reset filter type to default
    setPageSize(getInitialPageSize()); // Reset page size (if needed)
    setPageNumber(1);
  };  

  const handleFilterTypeChange = (e) => {
    setFilterType(e.target.value);
  };
  const toggleFiltersVisibility = () => {
    setFiltersVisible(!filtersVisible);
  };

  useEffect(() => {
    const fetchAssets = async () => {
      const response = await assetService.getFilteredAssets(
        pageNumber,
        pageSize,
        filters
      );
      if (response.status === 200) {
        const data = await response.json();
        setAssets(data.assetsForPage);
        setPageCount(Math.ceil(data.totalAssets / pageSize));
      } else {
        console.error("Error fetching assets:");
      }
    };
    fetchAssets();
  }, [isCreateModalOpen, pageNumber, pageSize, filters, isEditModalOpen]);

  const handleClick = () => {
    setIsCreateModalOpen(true);
  };

  return (
    <div className={styles.inventoryPage}>
      <div className={styles.controlPanel}>
        <div className={styles.btns}>
          <CreateAssetModal
            isOpen={isCreateModalOpen}
            onClose={() => isCreateModalOpen(false)}
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
              <option value="manufacturer">Manufacturer</option>
              <option value="partNumber">Part Number</option>
            </select>
            <input
              name={filterType}
              placeholder={
                filterType.charAt(0).toUpperCase() + filterType.slice(1)
              }
              value={filters[filterType]}
              onChange={handleFilterChange}
            />
            <select name="type" onChange={handleFilterChange}>
              <option value="">Select type</option>
              {types.map((assetType) => (
                <option key={assetType} value={assetType}>
                  {assetType}
                </option>
              ))}
            </select>
            <select name="sortBy" value={filters.sortBy} onChange={handleSortChange}>
              <option value="">Sort By</option>
              <option value="type">Type</option>
              <option value="manufacturer">Manufacturer</option>
              <option value="partNumber">Part Number</option>
            </select>
            <select name="orderBy" value={filters.orderBy} onChange={handleOrderChange}>
              <option value="">Order By</option>
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
            <button onClick={handleClearFilters}>Clear Filters</button>
          </div>
        )}
      </div>
      <AssetTable
        pageCount={pageCount}
        setPageNumber={setPageNumber}
        assets={assets}
      />
    </div>
  );
};

export default InventoryPage;
