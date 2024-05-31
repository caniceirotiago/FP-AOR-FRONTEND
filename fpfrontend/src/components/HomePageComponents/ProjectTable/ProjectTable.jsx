import React, { useState, useMemo, useEffect } from 'react';
import { useTable } from 'react-table';
import styles from './ProjectTable.module.css'; 
import projectService from '../../../services/projectService';
import { useNavigate } from 'react-router';

function ProjectTable({projects}) {
    const navigate = useNavigate();
    const handleClickToOpenProjectPage = (projectId) => () => {
        navigate(`/projectpage/${projectId}`);
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
        rows,
        prepareRow,
    } = useTable({ columns, data });

    return (
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
                {rows.map(row => {
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
    );
}

export default ProjectTable;
