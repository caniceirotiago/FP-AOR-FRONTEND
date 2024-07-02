import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { FormattedMessage, useIntl } from "react-intl";
import styles from "./Dashboard.module.css";
import reportService from "../../services/reportService";

const COLORS = [
  "var(--report-graphic-color1)",
  "var(--report-graphic-color2)",
  "var(--report-graphic-color3)",
  "var(--report-graphic-color4)",
  "var(--report-graphic-color5)",
  "var(--report-graphic-color6)",
];

const Dashboard = () => {
  const [projectData, setProjectData] = useState([]);
  const [assetData, setAssetData] = useState([]);
  const [averageMembers, setAverageMembers] = useState(0);
  const [averageDuration, setAverageDuration] = useState(0);
  const [approvedProjects, setApprovedProjects] = useState([]);
  const [completedProjects, setCompletedProjects] = useState([]);
  const [canceledProjects, setCanceledProjects] = useState([]);
  const intl = useIntl();

  useEffect(() => {
    const fetchProjectData = async () => {
      const response = await reportService.getProjectSummary();
      const data = await response.json();

      setAverageMembers(data.averageMembersPerProject.average);
      setAverageDuration(data.averageProjectDuration.average);

      const formattedProjectData = data.projectCountByLocation.map((item) => ({
        name: item.location,
        Projects: item.projectCount,
        Percentage: item.projectPercentage,
      }));

      setApprovedProjects(
        data.approvedProjectsByLocation.map((item) => ({
          name: item.location,
          Projects: item.projectCount,
        }))
      );

      setCompletedProjects(
        data.completedProjectsByLocation.map((item) => ({
          name: item.location,
          Projects: item.projectCount,
        }))
      );

      setCanceledProjects(
        data.canceledProjectsByLocation.map((item) => ({
          name: item.location,
          Projects: item.projectCount,
        }))
      );

      setProjectData(formattedProjectData);
    };

    const fetchAssetData = async () => {
      const response = await reportService.getAssetSummary();
      const data = await response.json();

      const formattedAssetData = data.topAssetsByUsedQuantity.map((item) => ({
        name: item[0],
        Quantity: item[2],
      }));

      setAssetData(formattedAssetData);
    };

    fetchProjectData();
    fetchAssetData();
  }, []);

  return (
    <div className={styles.dashboard}>
      {/* Average Members per Project */}
      <div className={styles.statisticContainer}>
        <h3 className={styles.chartTitle}>
          <FormattedMessage
            id="averageMembersTitle"
            defaultMessage="Average Members per Project"
          />
        </h3>
        <p className={styles.statisticValue}>
          <FormattedMessage
            id="averageMembersValue"
            defaultMessage="{averageMembers} members"
            values={{ averageMembers }}
          />
        </p>
      </div>
      {/* Average Project Duration */}
      <div className={styles.statisticContainer}>
        <h3 className={styles.chartTitle}>
          <FormattedMessage
            id="averageDurationTitle"
            defaultMessage="Average Project Duration"
          />
        </h3>
        <p className={styles.statisticValue}>
          <FormattedMessage
            id="averageDurationValue"
            defaultMessage="{averageDuration} days"
            values={{ averageDuration }}
          />
        </p>
      </div>
      {/* Projects by Location */}
      <div className={styles.chartContainer}>
        <h3 className={styles.chartTitle}>
          <FormattedMessage
            id="projectsByLocationTitle"
            defaultMessage="Projects by Location"
          />
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={projectData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="Projects" fill="var(--color-in-progress)" />
            <Bar dataKey="Percentage" fill="var(--color-ready)" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      {/* Top Assets by Quantity Used */}
      <div className={styles.chartContainer}>
        <h3 className={styles.chartTitle}>
          <FormattedMessage
            id="topAssetsTitle"
            defaultMessage="Top Assets by Quantity Used"
          />
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={assetData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="Quantity" fill="var(--color-planning)" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      {/* Approved Projects by Location */}
      <div className={styles.chartContainer}>
        <h3 className={styles.chartTitle}>
          <FormattedMessage
            id="approvedProjectsTitle"
            defaultMessage="Approved Projects by Location"
          />
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={approvedProjects}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="Projects" fill="var(--color-finished)" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      {/* Completed Projects by Location */}
      <div className={styles.chartContainer}>
        <h3 className={styles.chartTitle}>
          <FormattedMessage
            id="completedProjectsTitle"
            defaultMessage="Completed Projects by Location"
          />
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={completedProjects}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="Projects" fill="var(--report-graphic-color1)" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      {/* Canceled Projects by Location */}
      <div className={styles.chartContainer}>
        <h3 className={styles.chartTitle}>
          <FormattedMessage
            id="canceledProjectsTitle"
            defaultMessage="Canceled Projects by Location"
          />
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={canceledProjects}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="Projects" fill="var(--color-cancelled)" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      {/* Project Distribution by Location */}
      <div className={styles.chartContainer}>
        <h3 className={styles.chartTitle}>
          <FormattedMessage
            id="projectDistributionTitle"
            defaultMessage="Project Distribution by Location"
          />
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={projectData}
              dataKey="Percentage"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              label
            >
              {projectData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Legend />
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Dashboard;
