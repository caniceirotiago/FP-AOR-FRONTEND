// src/components/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import styles from './Dashboard.module.css';
import reportService from '../../services/reportService';

const Dashboard = () => {
  const [projectData, setProjectData] = useState([]);
  const [assetData, setAssetData] = useState([]);

  useEffect(() => {
    const fetchProjectData = async () => {
      const data = await reportService.getProjectSummary();
      const formattedData = data.projectCountByLocation.map(item => ({
        name: item.location,
        Projects: item.projectCount
      }));
      setProjectData(formattedData);
    };

    const fetchAssetData = async () => {
      const data = await reportService.getAssetSummary();
      const formattedData = data.topAssetsByUsedQuantity.map(item => ({
        name: item[0],
        Quantity: item[1]
      }));
      setAssetData(formattedData);
    };

    fetchProjectData();
    fetchAssetData();
  }, []);

  return (
    <div className={styles.dashboard}>
      <h2>Dashboard</h2>
      <div className={styles.chartContainer}>
        <h3>Projects by Location</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={projectData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="Projects" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className={styles.chartContainer}>
        <h3>Top Assets by Quantity Used</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={assetData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="Quantity" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Dashboard;
