import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { IntlProvider } from 'react-intl';
import SettingsPage from '../pages/SettingsPage/SettingsPage';
import useConfigurationStore from '../stores/useConfigurationStore';
import useDialogModalStore from '../stores/useDialogModalStore';

jest.mock('../stores/useConfigurationStore');
jest.mock('../stores/useDialogModalStore');

const messages = {
  settingsTitle: 'Settings',
  maxProjectMembersLabel: 'Max Project Members',
  updateSuccess: 'Configuration updated successfully',
  updateFailure: 'Failed to update configuration',
};

const mockConfigurations = {
  sessionTimeout: 10 * 60000, // 10 minutes in milliseconds
  maxProjectMembers: 10,
};

const mockFetchConfigurations = jest.fn();
const mockUpdateConfiguration = jest.fn();

beforeEach(() => {
  useConfigurationStore.mockReturnValue({
    configurations: mockConfigurations,
    fetchConfigurations: mockFetchConfigurations,
    updateConfiguration: mockUpdateConfiguration,
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

describe('SettingsPage Component', () => {
  it('renders the settings page correctly', () => {
    expect(screen.getByLabelText('Session Timeout [m]:')).toHaveValue('10');
    expect(screen.getByLabelText('Max Project Members:')).toHaveValue('10');
  });

  it('calls updateConfiguration when the save button is clicked', async () => {
    fireEvent.change(screen.getByLabelText('Session Timeout [m]:'), { target: { value: '15' } });
    fireEvent.change(screen.getByLabelText('Max Project Members:'), { target: { value: '20' } });

    fireEvent.click(screen.getByText('Save'));

    await waitFor(() => {
      expect(mockUpdateConfiguration).toHaveBeenCalledTimes(2);  // Two calls to updateConfiguration
      expect(mockUpdateConfiguration).toHaveBeenCalledWith({
        configKey: 'sessionTimeout',
        configValue: 15 * 60000,  // 15 minutes in milliseconds
      });
      expect(mockUpdateConfiguration).toHaveBeenCalledWith({
        configKey: 'maxProjectMembers',
        configValue: 20,
      });
    });
  });

  it('shows success message when configuration is updated', async () => {
    // Mock the successful configuration update
    mockUpdateConfiguration.mockResolvedValueOnce();

    fireEvent.change(screen.getByLabelText('Session Timeout [m]:'), { target: { value: '15' } });
    fireEvent.change(screen.getByLabelText('Max Project Members:'), { target: { value: '20' } });

    fireEvent.click(screen.getByText('Save'));

    await waitFor(() => {
      expect(screen.queryByText('Configuration updated successfully')).toBeInTheDocument();
    });
  });
});
