import React, { useState, useEffect, useMemo } from "react";
import { useTable, usePagination } from "react-table";
import styles from "./AssetTable.module.css";
import { FaEye, FaEdit } from "react-icons/fa";
import EditAssetModal from "../AssetsModal/EditAssetModal.jsx";
import useAssetsStore from "../../../stores/useAssetsStore.jsx";

function AssetTable({ pageCount, setPageNumber, assets }) {
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
        Header: "ID",
        accessor: "id",
      },
      {
        Header: "Name",
        accessor: "name",
      },
      {
        Header: "Type",
        accessor: "type",
      },
      {
        Header: "Description",
        accessor: "description",
      },
      {
        Header: "Stock Quantity",
        accessor: "stockQuantity",
      },
      {
        Header: "Part Number",
        accessor: "partNumber",
      },
      {
        Header: "Manufacturer",
        accessor: "manufacturer",
      },
      {
        Header: "Manufacturer Phone",
        accessor: "manufacturerPhone",
      },
      {
        Header: "Observations",
        accessor: "observations",
      },
      {
        Header: "Actions",
        id: "actions",
        accessor: "id",
        Cell: ({ value }) => (
          <div className={styles.actions}>
            <button
              onClick={handleViewAsset(value)}
              className={styles.actionButton}
            >
              <FaEye /> View
            </button>
            <button
              onClick={() => handleEditAsset(value)}
              className={styles.actionButton}
            >
              <FaEdit /> Edit
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

  /*
  useEffect(() => {
    setPageNumber(pageIndex + 1);
  }, [pageIndex, setPageNumber]);
  */

  return (
    <div className={styles.tableContainer}>
      <div className={styles.tblHeader}>
        <table {...getTableProps()} className={styles.table}>
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th {...column.getHeaderProps()} className={styles.header}>
                    {column.render("Header")}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
   
          <tbody {...getTableBodyProps()}>
            {page.map((row) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()} className={styles.row}>
                  {row.cells.map((cell) => (
                    <td {...cell.getCellProps()} className={styles.cell}>
                      {cell.render("Cell")}
                    </td>
                  ))}
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
