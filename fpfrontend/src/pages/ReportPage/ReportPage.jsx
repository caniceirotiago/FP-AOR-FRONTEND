import React from "react";
import { FormattedMessage, useIntl } from "react-intl";
import styles from "./ReportPage.module.css";
import reportService from "../../services/reportService";
import useDialogModalStore from "../../stores/useDialogModalStore.jsx";

const ReportPage = () => {
  const intl = useIntl();
  const { setDialogMessage, setIsDialogOpen, setAlertType, setOnConfirm } =
  useDialogModalStore();

  const generateReport = async (reportType) => {
    try {
      const response = await reportService.generatePdfReport(reportType);
      if (response.status === 200) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.target = "_blank";
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
        setOnConfirm(async () => {});
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className={styles.ReportPage}>
      <div className={styles.container}>
        <h3>
          <FormattedMessage id="reportGenerator" />
        </h3>
        <div className={styles.reportPanel}>
          <button
            onClick={() => generateReport("project")}
            className={styles.GenerateButton}
          >
            <FormattedMessage id="generateProjectsReport" />
          </button>
          <button
            onClick={() => generateReport("assets")}
            className={styles.GenerateButton}
          >
            <FormattedMessage id="generateAssetsReport" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportPage;
