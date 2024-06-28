import React from "react";
import styles from "./ReportPage.module.css";
import useDomainStore from "../../stores/useDomainStore";

const API_BASE_URL = "http://" + useDomainStore.getState().domain + "/rest/";

const getAuthHeaders = () => {
  return {
    Accept: "application/pdf",
    "Content-Type": "application/json",
  };
};

const ReportPage = () => {
  const generateReport = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}reports/project/summary/pdf`, {
        method: "GET",
        headers: getAuthHeaders(),
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("PDF generation failed");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.target = "_blank";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
      alert("Failed to generate report.");
    }
  };

  return (
    <div className={styles.ReportPage}>
      <div className={styles.container}>
        <h3>Report Generator</h3>
        <div className={styles.reportPanel}>
          <button onClick={generateReport} className={styles.GenerateButton}>
            Generate Report
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportPage;
