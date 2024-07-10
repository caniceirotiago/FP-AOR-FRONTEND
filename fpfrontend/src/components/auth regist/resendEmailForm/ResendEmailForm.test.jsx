import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { IntlProvider } from 'react-intl';
import { MemoryRouter } from 'react-router-dom';
import ResendEmailForm from './ResendEmailForm';
import userService from '../../../services/userService';
import DialogModalStore from '../../../stores/useDialogModalStore';

jest.mock('../../../services/userService');
jest.mock('../../../stores/useDialogModalStore');

const mockDialogModalStore = DialogModalStore;

const messages = {
  confirmationEmailSent: 'Confirmation Email Sent',
  resendEmail: 'Resend Confirmation Email',
  askForNewConfirmation: 'Ask For New Confirmation',
  back: 'Back'
};

describe('ResendEmailForm Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockDialogModalStore.mockReturnValue({
      setIsDialogOpen: jest.fn(),
      setDialogMessage: jest.fn(),
      setAlertType: jest.fn(),
      setOnConfirm: jest.fn(),
    });
  });

  const renderComponent = () =>
    render(
      <IntlProvider locale="en" messages={messages}>
        <MemoryRouter>
          <ResendEmailForm />
        </MemoryRouter>
      </IntlProvider>
    );

  it('renders the resend email form correctly', () => {
    renderComponent();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /ask for new confirmation/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /back/i })).toBeInTheDocument();
  });

  it('displays a success message when a new confirmation email is sent', async () => {
    userService.requestNewConfirmationEmail.mockResolvedValueOnce({ status: 204 });
    renderComponent();

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /ask for new confirmation/i }));
    });

    expect(userService.requestNewConfirmationEmail).toHaveBeenCalledWith('test@example.com');
    expect(mockDialogModalStore().setDialogMessage).toHaveBeenCalledWith(messages.confirmationEmailSent);
  });

  it('displays an error message if the email sending fails', async () => {
    userService.requestNewConfirmationEmail.mockResolvedValueOnce({
      status: 400,
      json: async () => ({ message: 'Failed to send confirmation email' }),
    });
    renderComponent();

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /ask for new confirmation/i }));
    });

    expect(userService.requestNewConfirmationEmail).toHaveBeenCalledWith('test@example.com');
    expect(mockDialogModalStore().setDialogMessage).toHaveBeenCalledWith('Failed to send confirmation email');
  });
});
