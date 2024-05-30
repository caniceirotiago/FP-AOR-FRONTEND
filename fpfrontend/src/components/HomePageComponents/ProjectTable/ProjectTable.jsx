import React from 'react';
import { useTable } from 'react-table';
import styles from './ProjectTable.module.css'; 

function ProjectTable() {
    const data = React.useMemo(
        () => [
            { 
                id: 1, 
                name: 'Project Alpha', 
                description: 'Exploration of Alpha technologies.', 
                state: 'ACTIVE', 
                creationDate: '2022-01-01T00:00:00Z', 
                finalDate: '2022-12-31T00:00:00Z',
                laboratory: 'Lab 1'
            },
            { 
                id: 2, 
                name: 'Project Beta', 
                description: 'Development of Beta tools.', 
                state: 'PLANNED', 
                creationDate: '2022-02-01T00:00:00Z', 
                finalDate: '2023-01-31T00:00:00Z',
                laboratory: 'Lab 2'
            }
        ],
        []
    );

    const columns = React.useMemo(
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
                accessor: 'finalDate',
            },
            {
                Header: 'Laboratory',
                accessor: 'laboratory',
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
                {headerGroups.map(headerGroup => {
                    const { key, ...headerGroupProps } = headerGroup.getHeaderGroupProps();
                    return (
                        <tr key={key} {...headerGroupProps}>
                            {headerGroup.headers.map(column => {
                                const { key, ...columnProps } = column.getHeaderProps();
                                return (
                                    <th key={key} {...columnProps} className={styles.header}>
                                        {column.render('Header')}
                                    </th>
                                );
                            })}
                        </tr>
                    );
                })}
            </thead>
            <tbody {...getTableBodyProps()}>
                {rows.map(row => {
                    prepareRow(row);
                    const { key, ...rowProps } = row.getRowProps();
                    return (
                        <tr key={key} {...rowProps} className={styles.row}>
                            {row.cells.map(cell => {
                                const { key, ...cellProps } = cell.getCellProps();
                                return (
                                    <td key={key} {...cellProps} className={styles.cell}>
                                        {cell.render('Cell')}
                                    </td>
                                );
                            })}
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );
}

export default ProjectTable;
