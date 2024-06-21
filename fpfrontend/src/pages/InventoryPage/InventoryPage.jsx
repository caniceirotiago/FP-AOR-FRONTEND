import React, { useEffect, useState } from "react";
import styles from "./InventoryPage.module.css";
import { useLocation } from "react-router-dom";
import { FormattedMessage, useIntl } from "react-intl";
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
  const [pageCount, setPageCount] = useState(1);
  const [pageNumber, setPageNumber] = useState(1);
  const defaultFilters = {
    name: "",
    type: "",
    manufacturer: "",
    partNumber: "",
    sortBy: "",
    orderBy: "",
  };
  const [filters, setFilters] = useState(defaultFilters);
  const [filterType, setFilterType] = useState("name", "type");
  const intl = useIntl();

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

  useEffect(() => {
    updatePageSize();
    window.addEventListener("resize", updatePageSize);
    return () => {
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
    setPageSize(getInitialPageSize()); // Reset page size to default
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
        const totalAssets = data.totalAssets;
        const newPageCount = Math.ceil(totalAssets / pageSize) || 1; // Ensure pageCount is at least 1
        setPageCount(newPageCount);
        // Validate and adjust the pageNumber if it exceeds pageCount
        if (pageNumber > newPageCount) {
          setPageNumber(newPageCount);
        }
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
            onClose={() => setIsCreateModalOpen(false)}
          />
          <button
            onClick={handleClick}
            className={`${styles.iconButton} ${styles.createButton}`}
            data-text={intl.formatMessage({ id: "createButtonText" })}
          >
            <FaPlus className={styles.svgIcon} />
          </button>
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
              <option value="manufacturer">
                <FormattedMessage
                  id="filterByManufacturer"
                  defaultMessage="Manufacturer"
                />
              </option>
              <option value="partNumber">
                <FormattedMessage
                  id="filterByPartNumber"
                  defaultMessage="Part Number"
                />
              </option>
            </select>
            <input
              name={filterType}
              placeholder={intl.formatMessage(
                { id: "filterPlaceholder" },
                {
                  type:
                    filterType.charAt(0).toUpperCase() + filterType.slice(1),
                }
              )}
              value={filters[filterType]}
              onChange={handleFilterChange}
            />
            <select
              name="type"
              value={filters.type}
              onChange={handleFilterChange}
            >
              <option value="">
                <FormattedMessage
                  id="selectType"
                  defaultMessage="Select type"
                />
              </option>
              {types.map((assetType) => (
                <option key={assetType} value={assetType}>
                  {assetType}
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
              <option value="type">
                <FormattedMessage id="sortByType" defaultMessage="Type" />
              </option>
              <option value="manufacturer">
                {" "}
                <FormattedMessage
                  id="sortByManufacturer"
                  defaultMessage="Manufacturer"
                />
              </option>
              <option value="partNumber">
                {" "}
                <FormattedMessage
                  id="sortByPartNumber"
                  defaultMessage="Part Number"
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
                {" "}
                <FormattedMessage
                  id="orderByAscending"
                  defaultMessage="Ascending"
                />
              </option>
              <option value="desc">
                {" "}
                <FormattedMessage
                  id="orderByDescending"
                  defaultMessage="Descending"
                />
              </option>
            </select>
            <button onClick={handleClearFilters}>
              <FormattedMessage
                id="clearFilters"
                defaultMessage="Clear Filters"
              />
            </button>
          </div>
        )}
      </div>
      <div className={styles.assetsPanel}>
        <AssetTable
          pageCount={pageCount}
          setPageNumber={setPageNumber}
          assets={assets}
        />
        {pageCount > 1 && (
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
            <FormattedMessage id="pageInfo" defaultMessage="Page" />{" "}
            <strong>
              {pageNumber}
               <FormattedMessage id="ofInfo" defaultMessage="of" />{" "}
              {pageCount}
            </strong>
          </span>
        </div>
        )}
      </div>
    </div>
  );
};

export default InventoryPage;
