import React, { useState, useMemo } from "react";
import { FormattedMessage } from "react-intl";
import { useTable, usePagination } from "react-table";
import styles from "./AssetTable.module.css";
import { FaEye, FaEdit } from "react-icons/fa";
import EditAssetModal from "../AssetsModal/EditAssetModal.jsx";
import useAssetsStore from "../../../stores/useAssetsStore.jsx";

function AssetTable({ pageCount, assets }) {
  const { isEditModalOpen, setEditModalOpen } = useAssetsStore();
  const [selectedAssetId, setSelectedAssetId] = useState(null);
  const [isViewOnly, setIsViewOnly] = useState(false);

  const handleViewAsset = (assetId) => () => {
    setSelectedAssetId(assetId);
    setIsViewOnly(true);
    setEditModalOpen(true);
  };

  const handleEditAsset = (assetId) => {
    setSelectedAssetId(assetId);
    setIsViewOnly(false);
    setEditModalOpen(true);
  };

  const data = useMemo(() => assets, [assets]);

  const columns = useMemo(
    () => [
      {
        Header: <FormattedMessage id="tableHeaderId" defaultMessage="ID" />,
        accessor: "id",
      },
      {
        Header: <FormattedMessage id="tableHeaderName" defaultMessage="Name" />,
        accessor: "name",
      },
      {
        Header: <FormattedMessage id="tableHeaderType" defaultMessage="Type" />,
        accessor: "type",
      },
      {
        Header: (
          <FormattedMessage
            id="tableHeaderDescription"
            defaultMessage="Description"
          />
        ),
        accessor: "description",
      },
      {
        Header: (
          <FormattedMessage
            id="tableHeaderStockQuantity"
            defaultMessage="Stock Quantity"
          />
        ),
        accessor: "stockQuantity",
      },
      {
        Header: (
          <FormattedMessage
            id="tableHeaderPartNumber"
            defaultMessage="Part Number"
          />
        ),
        accessor: "partNumber",
      },
      {
        Header: (
          <FormattedMessage
            id="tableHeaderManufacturer"
            defaultMessage="Manufacturer"
          />
        ),
        accessor: "manufacturer",
      },
      {
        Header: (
          <FormattedMessage
            id="tableHeaderManufacturerPhone"
            defaultMessage="Manufacturer Phone"
          />
        ),
        accessor: "manufacturerPhone",
      },
      {
        Header: (
          <FormattedMessage
            id="tableHeaderObservations"
            defaultMessage="Observations"
          />
        ),
        accessor: "observations",
      },
      {
        Header: (
          <FormattedMessage id="tableHeaderActions" defaultMessage="Actions" />
        ),
        id: "actions",
        accessor: "id",
        Cell: ({ value }) => (
          <div className={styles.actions}>
            <button
              onClick={handleViewAsset(value)}
              className={styles.actionButton}
            >
              <FaEye />{" "}
              <FormattedMessage id="actionView" defaultMessage="View" />
            </button>
            <button
              onClick={() => handleEditAsset(value)}
              className={styles.actionButton}
            >
              <FaEdit />{" "}
              <FormattedMessage id="actionEdit" defaultMessage="Edit" />
            </button>
          </div>
        ),
      },
    ],
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    state: { pageIndex },
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0 },
      manualPagination: true,
      pageCount: pageCount,
    },
    usePagination
  );

  return (
    <div className={styles.tableContainer}>
      <div className={styles.tblHeader}>
        <table {...getTableProps()} className={styles.table}>
          <thead>
            {headerGroups.map((headerGroup) => {
              const { key, ...restHeaderGroupProps } = headerGroup.getHeaderGroupProps();
              return (
                <tr key={key} {...restHeaderGroupProps}>
                  {headerGroup.headers.map((column) => {
                    const { key, ...restColumnProps } = column.getHeaderProps();
                    return (
                      <th key={key} {...restColumnProps} className={styles.header}>
                        {column.render("Header")}
                      </th>
                    );
                  })}
                </tr>
              );
            })}
          </thead>

          <tbody {...getTableBodyProps()}>
            {page.map((row) => {
              prepareRow(row);
              const { key, ...restRowProps } = row.getRowProps();
              return (
                <tr key={key} {...restRowProps} className={styles.row}>
                  {row.cells.map((cell) => {
                    const { key, ...restCellProps } = cell.getCellProps();
                    return (
                      <td key={key} {...restCellProps} className={styles.cell}>
                        {cell.render("Cell")}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {isEditModalOpen && (
        <EditAssetModal
          isOpen={isEditModalOpen}
          onClose={() => setEditModalOpen(false)}
          selectedAssetId={selectedAssetId}
          isViewOnly={isViewOnly}
        />
      )}
    </div>
  );
}

export default AssetTable;
