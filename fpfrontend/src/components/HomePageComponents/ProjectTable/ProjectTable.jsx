import React, { useMemo, useEffect } from "react";
import { useTable, usePagination } from "react-table";
import { FormattedMessage } from "react-intl";
import styles from "./ProjectTable.module.css";
import { useNavigate } from "react-router";
import useProjectStatesStore from "../../../stores/useProjectStatesStore";
import { FaEye, FaProjectDiagram } from "react-icons/fa";
import useProjectStore from "../../../stores/useProjectStore";
import { format } from 'date-fns';

function ProjectTable({ projects, pageCount, setPageNumber }) {
  const navigate = useNavigate();
  const { fetchProjectStates } = useProjectStatesStore();
  const { setSelectedProjectId } = useProjectStore();

  useEffect(() => {
    fetchProjectStates();
  }, [fetchProjectStates]);

  const handleClickToOpenProjectPage = (projectId) => () => {
    navigate(`/projectpage/${projectId}`);
  };
  const handleClickToOpenProjectPlanningPage = (projectId) => () => {
    setSelectedProjectId(projectId);
    navigate(`/projectplanning`);
  };

  const data = useMemo(() => projects, [projects]);

  const canSeeAndEditProjectPlanning = (project) => {
    return project?.members?.some(
      (user) =>
        user.userId === parseInt(localStorage.getItem("userId")) &&
        user.accepted
    );
  };
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return format(date, "yyyy/MM/dd");
  };
  

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
            Header: <FormattedMessage id="tableHeaderDescription" defaultMessage="Description" />,
            accessor: "description",
          },
          {
            Header: <FormattedMessage id="tableHeaderState" defaultMessage="State" />,
            accessor: "state",
          },
          {
            Header: <FormattedMessage id="tableHeaderCreationDate" defaultMessage="Creation Date" />,
            accessor: (row) => formatDate(row.creationDate),
            id: "creationDate",
          },
          {
            Header: <FormattedMessage id="tableHeaderFinalDate" defaultMessage="Final Date" />,
            accessor: (row) => formatDate(row.conclusionDate),
            id: "conclusionDate",
          },
          {
            Header: <FormattedMessage id="tableHeaderLaboratory" defaultMessage="Laboratory" />,
            accessor: "laboratory.locationName",
          },
          {
            Header: <FormattedMessage id="tableHeaderMembers" defaultMessage="Number of Members" />,
            accessor: "members.length",
          },
          {
            Header: <FormattedMessage id="tableHeaderCreatedBy" defaultMessage="Created By" />,
            accessor: "createdBy.username",
          },
          {
            Header: <FormattedMessage id="tableHeaderActions" defaultMessage="Actions" />,
            id: "actions",
            accessor: "id",
        Cell: ({ value }) => (
          <div className={styles.actions}>
            <button
              onClick={handleClickToOpenProjectPage(value)}
              className={styles.actionButton}
            >
              <FaEye />  <FormattedMessage id="actionView" defaultMessage="View" />
            </button>
            {canSeeAndEditProjectPlanning(
              projects.find((project) => project.id === value)
            ) && (
              <button
                onClick={handleClickToOpenProjectPlanningPage(value)}
                className={styles.actionButton}
              >
                <FaProjectDiagram /> <FormattedMessage id="actionPlan" defaultMessage="Plan" />
                </button>
            )}
          </div>
        ),
      },
    ],
    [projects]
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

  useEffect(() => {
    setPageNumber(pageIndex + 1);
  }, [pageIndex, setPageNumber]);

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
    </div>
  );
}

export default ProjectTable;
