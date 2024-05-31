import React, { useState, useMemo, useEffect } from 'react';
import { useTable, usePagination } from 'react-table';
import styles from './ProjectTable.module.css'; 
import projectService from '../../../services/projectService';
import { useNavigate } from 'react-router';

function ProjectTable({projects, pageCount, filters, setFilters, pageSize, setPageSize, setPageNumber }) {
    const navigate = useNavigate();
    const handleClickToOpenProjectPage = (projectId) => () => {
        navigate(`/projectpage/${projectId}`);
    }
    
    const handleFilterChange = (e) => {
        setFilters({
            ...filters,
            [e.target.name]: e.target.value
        });
    }
    const data = useMemo(() => projects, [projects]);

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
                Header: 'Description',
                accessor: 'description',
            },
            {
                Header: 'State',
                accessor: 'state',
            },
            {
                Header: 'Creation Date',
                accessor: 'creationDate',
            },
            {
                Header: 'Final Date',
                accessor: 'conclusionDate',
            },
            {
                Header: 'Laboratory',
                accessor: 'laboratory.location',
            },
            {
                Header: 'Number of Members',
                accessor: 'members.length',
            },
            {
                Header: 'Created By',
                accessor: 'createdBy.username',
            },
            {
                Header: 'Actions',
                id: 'actions',
                accessor: 'id',
                Cell: ({value}) => (
                    <div>
                        <button onClick={handleClickToOpenProjectPage(value)}>Project Page</button>
                        <button onClick={() => console.log(value)}>Project Plane</button>
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
        canPreviousPage,
        canNextPage,
        pageOptions,
        gotoPage,
        nextPage,
        previousPage,
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
        <>
            <div className={styles.filters}>
                <input name="name" placeholder="Name" onChange={handleFilterChange} />
                <input name="state" placeholder="State" onChange={handleFilterChange} />
                {/* Add more filters as needed */}
            </div>
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
            <div className={styles.pagination}>
                <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
                    {'<<'}
                </button>
                <button onClick={() => previousPage()} disabled={!canPreviousPage}>
                    {'<'}
                </button>
                <button onClick={() => nextPage()} disabled={!canNextPage}>
                    {'>'}
                </button>
                <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
                    {'>>'}
                </button>
                <span>
                    Page{' '}
                    <strong>
                        {pageIndex + 1} of {pageOptions.length}
                    </strong>{' '}
                </span>
            </div>
        </>
    );
}

export default ProjectTable;
