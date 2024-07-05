import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { IntlProvider } from 'react-intl';
import InventoryPage from '../pages/InventoryPage/InventoryPage';
import CreateAssetModal from '../components/InventoryComponents/AssetsModal/CreateAssetModal';
import assetService from '../services/assetService';
import useAssetsStore from '../stores/useAssetsStore';
import '@testing-library/jest-dom';

jest.mock('react-intl', () => ({
  ...jest.requireActual('react-intl'),
  useIntl: () => ({
    formatMessage: jest.fn((msg) => {
      const en = {
        createButtonText: 'Create Asset',
        filterButtonText: 'Filter',
        selectType: 'Select a type',
        assetName: 'Asset Name',
        description: 'Description',
        stockQuantity: 'Stock Quantity',
        partNumber: 'Part Number',
        manufacturer: 'Manufacturer',
        manufacturerPhone: 'Manufacturer Phone',
        observations: 'Observations',
        submitButton: 'Submit',
      };
      return en[msg.id] || msg.id;
    }),
  }),
}));
jest.mock('../services/assetService.jsx');
jest.mock('../stores/useAssetsStore.jsx');

// Mock asset data
const mockAssets = [
  { id: 1, name: 'Asset 1', type: 'RESOURCE', description: 'Description of Asset 1', stockQuantity: 12, partNumber: 'PartNumber1', manufacturer: 'Manufacturer A', manufacturerPhone: '239456789', observations: 'Observations for Asset 1' },
  { id: 2, name: 'Asset 2', type: 'COMPONENT', description: 'Description of Asset 2', stockQuantity: 8, partNumber: 'PartNumber2', manufacturer: 'Manufacturer B', manufacturerPhone: '239456789', observations: 'Observations for Asset 2' },
];

describe('CreateAssetModal Component', () => {
  beforeEach(() => {
    // Mock the useAssetsStore hook to return types
    useAssetsStore.mockReturnValue({
      fetchAssetTypes: jest.fn().mockResolvedValue({
        status: 200,
        json: async () => (['RESOURCE', 'COMPONENT']), // Mocked response data
      }),
      types: ['RESOURCE', 'COMPONENT'], // Ensure types are provided
      isEditModalOpen: false,
      setEditModalOpen: jest.fn(),
    });

    // Mock the getFilteredAssets method from assetService
    assetService.getFilteredAssets.mockResolvedValue({
      status: 200,
      json: async () => ({
        assetsForPage: mockAssets,
        totalAssets: 10,
      }),
    });
  });

  const renderWithIntl = (component) => {
    return render(
      <IntlProvider locale="en" messages={{}}>
        <Router>
          {component}
        </Router>
      </IntlProvider>
    );
  };

  test('renders InventoryPage component', async () => {
    renderWithIntl(<InventoryPage />);

    await waitFor(() => {
      expect(screen.getByText('Create Asset')).toBeInTheDocument();
      expect(screen.getByText('Filter')).toBeInTheDocument();
      expect(screen.getByText('Asset 1')).toBeInTheDocument();
      expect(screen.getByText('Asset 2')).toBeInTheDocument();
    });
  });

  test('opens create asset modal on button click', async () => {
    renderWithIntl(<InventoryPage />);

    fireEvent.click(screen.getByText('Create Asset'));
    await waitFor(() => {
      // Check for elements in the create asset modal
      expect(screen.getByText('Select a type')).toBeInTheDocument();
    });
  });

  test('renders CreateAssetModal correctly and submits form', async () => {
    renderWithIntl(<CreateAssetModal isOpen={true} onClose={jest.fn()} />);

    // Log the rendered output to debug
    console.log(screen.debug());

    await waitFor(() => {
      // Ensure types are populated in the dropdown
      expect(screen.getByText('Select a type')).toBeInTheDocument();
      expect(screen.getByText('RESOURCE')).toBeInTheDocument();
      expect(screen.getByText('COMPONENT')).toBeInTheDocument();
    });

   // Fill out the form and submit
fireEvent.change(screen.getByLabelText(/assetName/i), { target: { value: 'New Asset' } });
fireEvent.change(screen.getByLabelText(/description/i), { target: { value: 'New Asset Description' } });
fireEvent.change(screen.getByLabelText(/stockQuantity/i), { target: { value: '10' } });
fireEvent.change(screen.getByLabelText(/partNumber/i), { target: { value: 'NewPartNumber' } });
fireEvent.change(screen.getByLabelText(/manufacturer/i), { target: { value: 'New Manufacturer' } });
fireEvent.change(screen.getByLabelText(/manufacturerPhone/i), { target: { value: '1234567890' } });
fireEvent.change(screen.getByLabelText(/observations/i), { target: { value: 'New observations' } });
fireEvent.change(screen.getByLabelText(/type/i), { target: { value: 'RESOURCE' } });

fireEvent.click(screen.getByText(/submitButton/i));


    await waitFor(() => {
      // Check that the form was submitted and the modal closed
      expect(screen.queryByText('Submit')).not.toBeInTheDocument();
      expect(assetService.createAsset).toHaveBeenCalled();
    });
  });
});
