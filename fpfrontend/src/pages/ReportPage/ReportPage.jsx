import React from "react";
import { FormattedMessage, useIntl } from "react-intl";
import styles from "./ReportPage.module.css";
import reportService from "../../services/reportService";
import useDialogModalStore from "../../stores/useDialogModalStore.jsx";
import Dashboard from "../../components/dashboard/Dashboard";
import { FaFilePdf, FaDownload } from "react-icons/fa";
const ReportPage = () => {
  const intl = useIntl();
  const { setDialogMessage, setIsDialogOpen, setAlertType, setOnConfirm } =
    useDialogModalStore();

  // Function to generate PDF report based on reportType ('project' or 'asset')
  const generateReport = async (reportType) => {
    try {
      const response = await reportService.generatePdfReport(reportType);
      if (response.ok) {
        // If report generation is successful, create a download link for the PDF
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${reportType}_summary_report.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      } else {
        setDialogMessage(
          intl.formatMessage({
            id: "failedToGenerateReport",
            defaultMessage: "Failed to generate report.",
          })
        );
        setIsDialogOpen(true);
        setAlertType(true);
        setOnConfirm(() => {});
      }
    } catch (error) {
      console.error(error);
      setDialogMessage(
        intl.formatMessage({
          id: "failedToGenerateReport",
          defaultMessage: "Failed to generate report.",
        })
      );
      setIsDialogOpen(true);
      setAlertType(true);
      setOnConfirm(() => {});
    }
  };

  return (
    <div className={styles.ReportPage}>
      <div className={styles.container}>
        <div className={styles.dashboard}>
          <Dashboard />
        </div>
        <h3>
          <FormattedMessage id="reportGenerator" />
        </h3>
        <div className={styles.reportPanel}>
          <button
            onClick={() => generateReport("project")}
            className={styles.GenerateButton}
          >
            <FaFilePdf /> <FaDownload />{" "}
            <FormattedMessage id="generateProjectsReport" />
          </button>
          <button
            onClick={() => generateReport("asset")}
            className={styles.GenerateButton}
          >
            <FaFilePdf /> <FaDownload />{" "}
            <FormattedMessage id="generateAssetsReport" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportPage;
