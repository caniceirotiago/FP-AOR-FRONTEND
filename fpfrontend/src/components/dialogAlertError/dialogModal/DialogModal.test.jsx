import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { IntlProvider } from 'react-intl';
import DialogModal from './DialogModal';
import useDialogModalStore from '../../../stores/useDialogModalStore';

jest.mock('../../../stores/useDialogModalStore');

describe('DialogModal', () => {
  beforeEach(() => {
    useDialogModalStore.mockReturnValue({
      dialogMessage: 'Test Message',
      isDialogOpen: true,
      onConfirm: jest.fn(),
      clearDialog: jest.fn(),
      isAlertType: false,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const renderWithIntl = (component) => {
    return render(
      <IntlProvider locale="en" messages={{ cancel: "Cancel", yes: "Yes", ok: "OK" }}>
        {component}
      </IntlProvider>
    );
  };

  test('renders the modal with the message', () => {
    renderWithIntl(<DialogModal />);

    expect(screen.getByText('Test Message')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /yes/i })).toBeInTheDocument();
  });

  test('calls clearDialog on close button click', () => {
    const { clearDialog } = useDialogModalStore();

    renderWithIntl(<DialogModal />);

    fireEvent.click(screen.getByRole('button', { name: /cancel/i }));
    expect(clearDialog).toHaveBeenCalledTimes(1);
  });

  test('calls onConfirm and clearDialog on confirm button click', () => {
    const { onConfirm, clearDialog } = useDialogModalStore();

    renderWithIntl(<DialogModal />);

    fireEvent.click(screen.getByRole('button', { name: /yes/i }));
    expect(onConfirm).toHaveBeenCalledTimes(1);
    expect(clearDialog).toHaveBeenCalledTimes(1);
  });

  test('renders only OK button when isAlertType is true', () => {
    useDialogModalStore.mockReturnValueOnce({
      dialogMessage: 'Test Message',
      isDialogOpen: true,
      onConfirm: jest.fn(),
      clearDialog: jest.fn(),
      isAlertType: true,
    });

    renderWithIntl(<DialogModal />);

    expect(screen.queryByRole('button', { name: /cancel/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /yes/i })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /ok/i })).toBeInTheDocument();
  });

  test('does not render modal when isDialogOpen is false', () => {
    useDialogModalStore.mockReturnValueOnce({
      dialogMessage: 'Test Message',
      isDialogOpen: false,
      onConfirm: jest.fn(),
      clearDialog: jest.fn(),
      isAlertType: false,
    });

    const { container } = renderWithIntl(<DialogModal />);

    expect(container.firstChild).toBeNull();
  });
});
