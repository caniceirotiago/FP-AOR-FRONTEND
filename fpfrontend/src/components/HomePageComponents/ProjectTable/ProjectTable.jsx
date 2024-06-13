import React, { useState, useMemo, useEffect } from 'react';
import { useTable, usePagination } from 'react-table';
import styles from './ProjectTable.module.css'; 
import projectService from '../../../services/projectService';
import { useNavigate } from 'react-router';
import useProjectStatesStore from '../../../stores/useProjectStatesStore';
import { FaEye, FaProjectDiagram } from 'react-icons/fa';

function ProjectTable({ projects, pageCount, setPageNumber }) {
    const navigate = useNavigate();
    const { fetchProjectStates } = useProjectStatesStore();

    useEffect(() => {
        fetchProjectStates();
    }, [fetchProjectStates]);

    const handleClickToOpenProjectPage = (projectId) => () => {
        navigate(`/projectpage/${projectId}`);
    }
    const handleClickToOpenProjectPlanningPage = (projectId) => () => {
        navigate(`/projectplanning/${projectId}`);
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
                Cell: ({ value }) => (
                    <div className={styles.actions}>
                        <button onClick={handleClickToOpenProjectPage(value)} className={styles.actionButton}>
                            <FaEye /> View
                        </button>
                        <button onClick={handleClickToOpenProjectPlanningPage(value)} className={styles.actionButton}>
                            <FaProjectDiagram /> Plan
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

export default ProjectTable;
