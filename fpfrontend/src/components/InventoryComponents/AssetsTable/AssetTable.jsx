import React, { useState, useEffect, useMemo } from 'react';
import { useTable, usePagination } from 'react-table';
import styles from './AssetTable.module.css'; 
import { FaEye, FaEdit } from 'react-icons/fa';
import EditAssetModal from '../AssetsModal/EditAssetModal.jsx';

function AssetTable({ assets, pageCount, setPageNumber }) {
    const [selectedAsset, setSelectedAsset] = useState(null); // Track selected asset for editing
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const handleViewAsset = (assetId) => () => {
        console.log('Clicked on view asset:', assetId);
        const selected = assets.find(asset => asset.id === assetId);
        setSelectedAsset(selected);
        setIsEditModalOpen(true);
        //setViewOnlyMode;
    }

    const handleEditAsset = (assetId) => {
        console.log('Clicked on Edit asset:', assetId);
        console.log(' handleEditAsset assets', assets);
        const selected = assets.find(asset => asset.id === assetId);
        setSelectedAsset(selected);
        console.log('Selected asset:', selected);
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


    
    console.log('AssetTable assets:', assets);
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
        {isEditModalOpen && selectedAsset && (
            <EditAssetModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                asset={selectedAsset}
            />
        )}
    </div>
 );
};

export default AssetTable;
