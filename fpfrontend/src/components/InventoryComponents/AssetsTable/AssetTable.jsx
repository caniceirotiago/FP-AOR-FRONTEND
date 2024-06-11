import React, { useMemo, useEffect } from 'react';
import { useTable, usePagination } from 'react-table';
import styles from './AssetTable.module.css'; 
import { useNavigate } from 'react-router';
import { FaEye, FaEdit } from 'react-icons/fa';

function AssetTable({ assets, pageCount, setPageNumber }) {
    const navigate = useNavigate();

    const handleClickToOpenAssetPage = (assetId) => () => {
        navigate(`/assetpage/${assetId}`);
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
                Header: 'Project ID',
                accessor: 'projectId',
            },
            {
                Header: 'Actions',
                id: 'actions',
                accessor: 'id',
                Cell: ({ value }) => (
                    <div className={styles.actions}>
                        <button onClick={handleClickToOpenAssetPage(value)} className={styles.actionButton}>
                            <FaEye /> View
                        </button>
                        <button onClick={() => console.log(value)} className={styles.actionButton}>
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
        </div>
    );
}

export default AssetTable;
