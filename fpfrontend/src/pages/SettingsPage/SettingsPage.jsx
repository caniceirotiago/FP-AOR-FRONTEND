import React, { useState, useEffect } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import styles from "./SettingsPage.module.css";
import configurationService from "../../services/configurationService";
import useConfigurationStore from "../../stores/useConfigurationStore";
import useDialogModalStore from "../../stores/useDialogModalStore.jsx";

const MIN_SESSION_TIMEOUT_MINUTES = 10;

const SettingsPage = () => {
  const { configurations, fetchConfigurations } = useConfigurationStore();
  const { setDialogMessage, setIsDialogOpen, setAlertType, setOnConfirm } =
    useDialogModalStore();
  const [newSessionTimeout, setNewSessionTimeout] = useState("");
  const [newMaxProjectMembers, setNewMaxProjectMembers] = useState("");
  const [isEditingB1, setIsEditingB1] = useState(false);
  const [isEditingB2, setIsEditingB2] = useState(false);
  const intl = useIntl();

  // Fetch configurations when the component mounts
  useEffect(() => {
    fetchConfigurations();
  }, [fetchConfigurations]);

  // Set initial values when configurations change
  useEffect(() => {
    const sessionTimeout = configurations.get("sessionTimeout");
    if (sessionTimeout !== undefined) {
      setNewSessionTimeout(Math.ceil(sessionTimeout / 60000));
    }
    const maxProjectMembers = configurations.get("maxProjectMembers");
    if (maxProjectMembers !== undefined) {
      setNewMaxProjectMembers(maxProjectMembers);
    }
  }, [configurations]);

  // Function to handle input changes for session timeout
  const handleInputChangeB1 = (e) => {
    setNewSessionTimeout(e.target.value);
  };

  // Function to handle input changes for max project members
  const handleInputChangeB2 = (e) => {
    setNewMaxProjectMembers(e.target.value);
  };

  // Function to update session timeout
  const handleSessionTimeoutUpdate = async () => {
    const sessionTimeoutInMinutes = parseFloat(newSessionTimeout);
    if (
      isNaN(sessionTimeoutInMinutes) ||
      sessionTimeoutInMinutes < MIN_SESSION_TIMEOUT_MINUTES
    ) {
      setDialogMessage(
        intl.formatMessage({
          id: "configurationInvalidValue",
          defaultMessage: `Session timeout must be at least ${MIN_SESSION_TIMEOUT_MINUTES} minutes.`,
        })
      );
      setIsDialogOpen(true);
      setAlertType(true);
      setOnConfirm(async () => {});
      return;
    }

    const updateSessionTimeoutDto = {
      configKey: "sessionTimeout",
      // Convert from minutes to milliseconds
      configValue: sessionTimeoutInMinutes * 60000,
    };

    try {
      const response = await configurationService.updateConfig(
        updateSessionTimeoutDto
      );
      if (response.status === 204) {
        setDialogMessage(
          intl.formatMessage({
            id: "configurationSuccess",
            defaultMessage: "Configuration Updated Successfully",
          })
        );
        setIsDialogOpen(true);
        setAlertType(true);
        setOnConfirm(async () => {});
        setIsEditingB1(false);
      } else {
        setDialogMessage(
          intl.formatMessage({
            id: "configurationFailure",
            defaultMessage: "Failed to update Configuration",
          })
        );
        setIsDialogOpen(true);
        setAlertType(true);
        setOnConfirm(async () => {});
        setIsEditingB1(false);
      }
    } catch (error) {
      console.error("Failed to Configuration:", error);
    }
  };

  // Function to update max project members
  const handleProjectMembersUpdate = async () => {
    const updateMaxProjectMembersDto = {
      configKey: "maxProjectMembers",
      configValue: newMaxProjectMembers,
    };

    try {
      const response = await configurationService.updateConfig(
        updateMaxProjectMembersDto
      );
      if (response.status === 204) {
        setDialogMessage(
          intl.formatMessage({
            id: "configurationSuccess",
            defaultMessage: "Configuration Updated Successfully",
          })
        );
        setIsDialogOpen(true);
        setAlertType(true);
        setOnConfirm(async () => {});
        setIsEditingB2(false);
      } else {
        setDialogMessage(
          intl.formatMessage({
            id: "configurationFailure",
            defaultMessage: "Failed to update Configuration",
          })
        );
        setIsDialogOpen(true);
        setAlertType(true);
        setOnConfirm(async () => {});
        setIsEditingB2(false);
      }
    } catch (error) {
      console.error("Failed to update Configuration:", error);
    }
  };

  return (
    <div className={styles.SettingsPage}>
      <div className={styles.configPanel}>
        <div className={styles.configTitle}>
          <h3>
            <FormattedMessage
              id="configurationPanel"
              defaultMessage="Configuration Panel"
            />
          </h3>
        </div>
        <table className={styles.configTable}>
          <tbody>
            <tr>
              <td>
                <label htmlFor="sessionTimeout">
                  <FormattedMessage
                    id="sessionTimeoutLabel"
                    defaultMessage="Session Timeout [m]: "
                  />
                </label>
              </td>
              <td>
                <input
                  type="number"
                  id="sessionTimeout"
                  value={newSessionTimeout}
                  onChange={handleInputChangeB1}
                  disabled={!isEditingB1}
                  className={isEditingB1 ? styles.editMode : styles.viewMode}
                  min={MIN_SESSION_TIMEOUT_MINUTES}
                />
              </td>
              <td>
                {isEditingB1 ? (
                  <button onClick={handleSessionTimeoutUpdate}>
                    <FormattedMessage id="saveButton" defaultMessage="Save" />
                  </button>
                ) : (
                  <button onClick={() => setIsEditingB1(true)}>
                    <FormattedMessage
                      id="editBtnProfForm"
                      defaultMessage="Edit"
                    />
                  </button>
                )}
              </td>
            </tr>
            <tr>
              <td>
                <label htmlFor="maxProjectMembers">
                  <FormattedMessage
                    id="maxProjectMembersLabel"
                    defaultMessage="Max Project Members: "
                  />
                </label>
              </td>
              <td>
                <input
                  type="number"
                  id="maxProjectMembers"
                  value={newMaxProjectMembers}
                  onChange={handleInputChangeB2}
                  disabled={!isEditingB2}
                  className={isEditingB2 ? styles.editMode : styles.viewMode}
                  min={1}
                />
              </td>
              <td>
                {isEditingB2 ? (
                  <button onClick={handleProjectMembersUpdate}>
                    <FormattedMessage id="saveButton" defaultMessage="Save" />
                  </button>
                ) : (
                  <button onClick={() => setIsEditingB2(true)}>
                    <FormattedMessage
                      id="editBtnProfForm"
                      defaultMessage="Edit"
                    />
                  </button>
                )}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};


export default SettingsPage;
