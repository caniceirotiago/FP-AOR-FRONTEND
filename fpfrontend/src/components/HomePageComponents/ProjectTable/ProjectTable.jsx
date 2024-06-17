import React, { useState, useMemo, useEffect } from 'react';
import { useTable, usePagination } from 'react-table';
import styles from './ProjectTable.module.css'; 
import projectService from '../../../services/projectService';
import { useNavigate } from 'react-router';
import useProjectStatesStore from '../../../stores/useProjectStatesStore';
import { FaEye, FaProjectDiagram } from 'react-icons/fa';
import useProjectStore from '../../../stores/useProjectStore';

function ProjectTable({ projects, pageCount, setPageNumber }) {
    const navigate = useNavigate();
    const { fetchProjectStates } = useProjectStatesStore();
    const { selectedProjectId, setSelectedProjectId } = useProjectStore();


    useEffect(() => {
        fetchProjectStates();
    }, [fetchProjectStates]);

    const handleClickToOpenProjectPage = (projectId) => () => {
        navigate(`/projectpage/${projectId}`);
    }
    const handleClickToOpenProjectPlanningPage = (projectId) => () => {
        setSelectedProjectId(projectId);
        navigate(`/projectplanning`);
    }

    const data = useMemo(() => projects, [projects]);

    const canSeeAndEditProjectPlanning = (project) => {
        return project?.members?.some(
            (user) =>
                user.userId === parseInt(localStorage.getItem("userId")) &&
                user.accepted
        );
    }

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
                        {canSeeAndEditProjectPlanning(projects.find(project => project.id === value)) && (
                            <button onClick={handleClickToOpenProjectPlanningPage(value)} className={styles.actionButton}>
                                <FaProjectDiagram /> Plan
                            </button>
                        )}
                    </div>
                )
            }
        ],
        [projects]
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
