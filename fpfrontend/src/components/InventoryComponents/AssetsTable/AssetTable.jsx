import React, { useState, useEffect, useMemo } from 'react';
import { useTable, usePagination } from 'react-table';
import styles from './AssetTable.module.css'; 
import { FaEye, FaEdit } from 'react-icons/fa';
import EditAssetModal from '../AssetsModal/EditAssetModal.jsx';
import useAssetStore from '../../../stores/useAssetStore.jsx';

function AssetTable({ pageCount, setPageNumber }) {
    const [selectedAssetId, setSelectedAssetId] = useState(null); // Track selected asset id for editing
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const { assets, fetchAssets } = useAssetStore();

    const handleViewAsset = (assetId) => () => {
        console.log('Clicked on view asset:', assetId);
        setIsEditModalOpen(true);
        //setViewOnlyMode;
    }

    const handleEditAsset = (assetId) => {
        setSelectedAssetId(assetId);
        console.log('Selected asset id:', assetId);
        setIsEditModalOpen(true);
    }

    const data = useMemo(() => assets, [assets]);


    const columns = useMemo(
        () => [
            {
                Header: 'ID',
                accessor: 'id',
            },
            {
                Header: 'Name',
                accessor: 'name',
            },
            {
                Header: 'Type',
                accessor: 'type',
            },
            {
                Header: 'Description',
                accessor: 'description',
            },
            {
                Header: 'Stock Quantity',
                accessor: 'stockQuantity',
            },
            {
                Header: 'Part Number',
                accessor: 'partNumber',
            },
            {
                Header: 'Manufacturer',
                accessor: 'manufacturer',
            },
            {
                Header: 'Manufacturer Phone',
                accessor: 'manufacturerPhone',
            },
            {
                Header: 'Observations',
                accessor: 'observations',
            },
            {
                Header: 'Actions',
                id: 'actions',
                accessor: 'id',
                Cell: ({ value }) => (
                    <div className={styles.actions}>
                        <button onClick={handleViewAsset(value)} className={styles.actionButton}>
                            <FaEye /> View
                        </button>
                        <button onClick={() => handleEditAsset(value)} className={styles.actionButton}>
                            <FaEdit /> Edit
                        </button>
                    </div>
                )
            }
        ],
        []
    );

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        prepareRow,
        page,
        state: { pageIndex }
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

    useEffect(() => {
        setPageNumber(pageIndex + 1); 
    }, [pageIndex, setPageNumber]);


    return (
        <div className={styles.tableContainer}>
            <div className={styles.tblHeader}>
                <table {...getTableProps()} className={styles.table}>
                    <thead>
                        {headerGroups.map(headerGroup => (
                            <tr {...headerGroup.getHeaderGroupProps()}>
                                {headerGroup.headers.map(column => (
                                    <th {...column.getHeaderProps()} className={styles.header}>
                                        {column.render('Header')}
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                </table>
            </div>
            <div className={styles.tblContent}>
                <table {...getTableProps()} className={styles.table}>
                    <tbody {...getTableBodyProps()}>
                        {page.map(row => {
                            prepareRow(row);
                            return (
                                <tr {...row.getRowProps()} className={styles.row}>
                                    {row.cells.map(cell => (
                                        <td {...cell.getCellProps()} className={styles.cell}>
                                            {cell.render('Cell')}
                                        </td>
                                    ))}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
                </div>
        {isEditModalOpen && selectedAssetId && (
            <EditAssetModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                asset={selectedAssetId}
            />
        )}
    </div>
 );
};

export default AssetTable;
