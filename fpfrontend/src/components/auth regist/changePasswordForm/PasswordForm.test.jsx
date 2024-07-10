import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { IntlProvider } from 'react-intl';
import PasswordForm from './PasswordForm';
import useDialogModalStore from '../../../stores/useDialogModalStore';
import DialogMultipleMessagesModalStore from '../../../stores/useDialogMultipleMessagesModalStore';
import userService from '../../../services/userService';

jest.mock('../../../stores/useDialogModalStore');
jest.mock('../../../stores/useDialogMultipleMessagesModalStore');
jest.mock('../../../services/userService');

const messages = {
  oldPassword: 'Old Password',
  newPassword: 'New Password',
  confirmNewPassword: 'Confirm New Password',
  passwordRequired: 'Password is required',
  passwordsDoNotMatch: 'Passwords do not match',
  passwordValidationError: 'Password must be at least 8 characters long, include an uppercase letter, a lowercase letter, a number, and a special character.',
  passwordNotStrongEnough: 'Password is not strong enough',
  passwordChangedSuccess: 'Password Changed Successfully!',
  passwordUpdateFail: 'Not able to change password, contact support.',
  validationErrors: 'Validation Errors',
};

beforeEach(() => {
  useDialogModalStore.mockReturnValue({
    setDialogMessage: jest.fn(),
    setIsDialogOpen: jest.fn(),
    setAlertType: jest.fn(),
    setOnConfirm: jest.fn(),
  });

  DialogMultipleMessagesModalStore.mockReturnValue({
    setDialogMultipleMessages: jest.fn(),
    setDialogMultipleMessagesTitle: jest.fn(),
    setIsDialogMultipleMessagesOpen: jest.fn(),
  });

  userService.updateUserPassword.mockResolvedValue({ status: 204 });
});

describe('PasswordForm Component', () => {
  it('renders the password form correctly', () => {
    render(
      <IntlProvider locale="en" messages={messages}>
        <PasswordForm />
      </IntlProvider>
    );

    expect(screen.getByLabelText('Old Password')).toBeInTheDocument();
    expect(screen.getByLabelText('New Password')).toBeInTheDocument();
    expect(screen.getByLabelText('Confirm New Password')).toBeInTheDocument();
  });

  it('displays validation error if passwords do not match', async () => {
    render(
      <IntlProvider locale="en" messages={messages}>
        <PasswordForm />
      </IntlProvider>
    );

    fireEvent.change(screen.getByLabelText('Old Password'), { target: { value: 'oldpassword' } });
    fireEvent.change(screen.getByLabelText('New Password'), { target: { value: 'newpassword' } });
    fireEvent.change(screen.getByLabelText('Confirm New Password'), { target: { value: 'differentpassword' } });

    fireEvent.click(screen.getByText('Save'));

    await waitFor(() => {
      expect(DialogMultipleMessagesModalStore().setDialogMultipleMessages).toHaveBeenCalledWith(
        expect.arrayContaining([expect.stringContaining('Passwords do not match')])
      );
    });
  });

  it('calls userService.updateUserPassword on valid form submission', async () => {
    render(
      <IntlProvider locale="en" messages={messages}>
        <PasswordForm />
      </IntlProvider>
    );

    fireEvent.change(screen.getByLabelText('Old Password'), { target: { value: 'oldpassword' } });
    fireEvent.change(screen.getByLabelText('New Password'), { target: { value: 'Newpassword1!' } });
    fireEvent.change(screen.getByLabelText('Confirm New Password'), { target: { value: 'Newpassword1!' } });

    fireEvent.click(screen.getByText('Save'));

    await waitFor(() => {
      expect(userService.updateUserPassword).toHaveBeenCalledWith('oldpassword', 'Newpassword1!');
    });
  });

  it('displays success message on successful password update', async () => {
    render(
      <IntlProvider locale="en" messages={messages}>
        <PasswordForm />
      </IntlProvider>
    );

    fireEvent.change(screen.getByLabelText('Old Password'), { target: { value: 'oldpassword' } });
    fireEvent.change(screen.getByLabelText('New Password'), { target: { value: 'Newpassword1!' } });
    fireEvent.change(screen.getByLabelText('Confirm New Password'), { target: { value: 'Newpassword1!' } });

    fireEvent.click(screen.getByText('Save'));

    await waitFor(() => {
      expect(useDialogModalStore().setDialogMessage).toHaveBeenCalledWith(messages.passwordChangedSuccess);
    });
  });

  it('displays failure message on unsuccessful password update', async () => {
    userService.updateUserPassword.mockResolvedValueOnce({ status: 400 });

    render(
      <IntlProvider locale="en" messages={messages}>
        <PasswordForm />
      </IntlProvider>
    );

    fireEvent.change(screen.getByLabelText('Old Password'), { target: { value: 'oldpassword' } });
    fireEvent.change(screen.getByLabelText('New Password'), { target: { value: 'Newpassword1!' } });
    fireEvent.change(screen.getByLabelText('Confirm New Password'), { target: { value: 'Newpassword1!' } });

    fireEvent.click(screen.getByText('Save'));

    await waitFor(() => {
      expect(useDialogModalStore().setDialogMessage).toHaveBeenCalledWith(messages.passwordUpdateFail);
    });
  });
});
