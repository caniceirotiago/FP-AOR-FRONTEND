import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect'; // Import this for better jest-dom support
import CreateAssetModal from '../components/InventoryComponents/AssetsModal/CreateAssetModal';
import { useIntl } from 'react-intl';


jest.mock('react-intl', () => ({
    ...jest.requireActual('react-intl'),
    useIntl: () => ({ formatMessage: jest.fn() }),
  }));

describe('CreateAssetModal Component', () => {
  it('renders correctly and submits form', async () => {
    const mockOnClose = jest.fn();
    render(<CreateAssetModal isOpen={true} onClose={mockOnClose} />);

    // Fill out the form inputs
    fireEvent.change(screen.getByLabelText('Asset Name'), { target: { value: 'New Asset' } });
    fireEvent.change(screen.getByLabelText('Type'), { target: { value: 'RESOURCE' } });
    fireEvent.change(screen.getByLabelText('Description'), { target: { value: 'Asset description' } });
    fireEvent.change(screen.getByLabelText('Stock Quantity'), { target: { value: '10' } });
    fireEvent.change(screen.getByLabelText('Part Number'), { target: { value: '12345' } });
    fireEvent.change(screen.getByLabelText('Manufacturer'), { target: { value: 'Manufacturer A' } });
    fireEvent.change(screen.getByLabelText('Manufacturer Phone'), { target: { value: '123-456-7890' } });
    fireEvent.change(screen.getByLabelText('Observations'), { target: { value: 'Additional observations' } });

    // Submit the form
    fireEvent.click(screen.getByText('Submit'));

    // Await for async operations (like API calls) to complete
    await waitFor(() => {
      // Check that onClose was called (modal closed)
      expect(mockOnClose).toHaveBeenCalled();
    });

    // Optionally, assert on dialog/modal content being displayed
    expect(screen.getByText('Asset created successfully!')).toBeInTheDocument();
  });
});
