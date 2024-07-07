import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { IntlProvider } from 'react-intl';
import SettingsPage from "../pages/SettingsPage/SettingsPage";
import configurationService from "../services/configurationService";
import useConfigurationStore from "../stores/useConfigurationStore";
import useDialogModalStore from "../stores/useDialogModalStore"; 

jest.mock("../services/configurationService");
jest.mock("../stores/useConfigurationStore");
jest.mock("../stores/useDialogModalStore");

const messages = {
  settingsTitle: "Settings",
  maxProjectMembersLabel: "Max Project Members",
  updateSuccess: "Configuration updated successfully",
  updateFailure: "Failed to update configuration",
};

const mockConfigurations = {
    maxProjectMembers: 10,
    sessionTimeout: 10,
  };
  
  describe("SettingsPage Component", () => {
    beforeEach(() => {
      useConfigurationStore.mockReturnValue({
        configurations: mockConfigurations,
        fetchConfigurations: jest.fn(),
      });
  
      useDialogModalStore.mockReturnValue({
        setDialogMessage: jest.fn(),
        setIsDialogOpen: jest.fn(),
        setAlertType: jest.fn(),
        setOnConfirm: jest.fn(),
      });
  
      render(
        <IntlProvider locale="en" messages={messages}>
          <SettingsPage />
        </IntlProvider>
      );
    });
  
    it("renders the settings page correctly", () => {
      expect(screen.getByLabelText("Session Timeout [m]:")).toHaveValue("10");
      expect(screen.getByLabelText("Max Project Members:")).toHaveValue("10");
    });
  
    it("updates session timeout configuration", async () => {
        render(<SettingsPage />);
    
        // Wait for the component to render and fetch configurations
        await waitFor(() => {
          // Find the input and change its value
          const input = screen.getByLabelText("Session Timeout [m]:");
          fireEvent.change(input, { target: { value: "20" } });
    
          // Find and click the "Edit" button to switch to editing mode
          const editButton = screen.getByText("Edit");
          fireEvent.click(editButton);
    
          // Find and click the "Save" button to update the session timeout
          const saveButton = screen.getByText("Save");
          fireEvent.click(saveButton);
        });
    
        // Assert that the configuration update process is triggered
        // Ensure your updateConfig mock or service function is called
        // with the correct parameters and that the expected success message is displayed.
        expect(configurationService.updateConfig).toHaveBeenCalledWith({
          configKey: "sessionTimeout",
          configValue: 20 * 60000, // Convert minutes to milliseconds if needed
        });
      });
    });
  
    it("updates max project members configuration", async () => {
      const input = screen.getByLabelText("Max Project Members:");
      fireEvent.change(input, { target: { value: "20" } });
  
      const saveButton = screen.getByText("Save");
      fireEvent.click(saveButton);
  
      await waitFor(() => {
        expect(
          screen.getByText("Configuration updated successfully")
        ).toBeInTheDocument();
      });
    });
  });
