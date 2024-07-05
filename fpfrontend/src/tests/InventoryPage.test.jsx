import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { IntlProvider } from 'react-intl';
import en from '../translations/en.json';
import InventoryPage from '../pages/InventoryPage/InventoryPage';
import CreateAssetModal from '../components/CreateAssetModal'; // Assuming it's imported from here
import assetService from '../services/assetService';
import useAssetsStore from '../stores/useAssetsStore';
import useLayoutStore from '../stores/useLayoutStore';
import useTranslationsStore from '../stores/useTranslationsStore';
import useDeviceStore from '../stores/useDeviceStore';
import '@testing-library/jest-dom';

jest.mock('../stores/useLayoutStore');
jest.mock('../stores/useTranslationsStore');
jest.mock('react-intl', () => ({
  ...jest.requireActual('react-intl'),
  useIntl: () => ({
    formatMessage: jest.fn((msg) => en[msg.id] || msg.id),
  }),
}));
jest.mock('../services/assetService');
jest.mock('../stores/useAssetsStore');

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
      <IntlProvider locale="en" messages={en}>
        <Router>
          {component}
        </Router>
      </IntlProvider>
    );
  };

  test('renders InventoryPage component', async () => {
    renderWithIntl(<InventoryPage />);

    await waitFor(() => {
      expect(screen.getByText(en.createButtonText)).toBeInTheDocument();
      expect(screen.getByText(en.filterButtonText)).toBeInTheDocument();
      expect(screen.getByText('Asset 1')).toBeInTheDocument();
      expect(screen.getByText('Asset 2')).toBeInTheDocument();
    });
  });

  test('opens create asset modal on button click', async () => {
    renderWithIntl(<InventoryPage />);

    fireEvent.click(screen.getByText(en.createButtonText));
    await waitFor(() => {
      // Check for elements in the create asset modal
      expect(screen.getByText(en.selectType)).toBeInTheDocument();
    });
  });

  test('renders CreateAssetModal correctly and submits form', async () => {
    renderWithIntl(<CreateAssetModal />);

    await waitFor(() => {
      // Ensure types are populated in the dropdown
      expect(screen.getByText(en.selectType)).toBeInTheDocument();
      expect(screen.getByText('RESOURCE')).toBeInTheDocument();
      expect(screen.getByText('COMPONENT')).toBeInTheDocument();
    });

    // Fill out the form and submit
    fireEvent.change(screen.getByPlaceholderText(en.assetName), { target: { value: 'New Asset' } });
    fireEvent.change(screen.getByPlaceholderText(en.description), { target: { value: 'New Asset Description' } });
    fireEvent.change(screen.getByPlaceholderText(en.stockQuantity), { target: { value: '10' } });
    fireEvent.change(screen.getByPlaceholderText(en.partNumber), { target: { value: 'NewPartNumber' } });
    fireEvent.change(screen.getByPlaceholderText(en.manufacturer), { target: { value: 'New Manufacturer' } });
    fireEvent.change(screen.getByPlaceholderText(en.manufacturerPhone), { target: { value: '1234567890' } });
    fireEvent.change(screen.getByPlaceholderText(en.observations), { target: { value: 'New observations' } });
    fireEvent.change(screen.getByText(en.selectType), { target: { value: 'RESOURCE' } });

    fireEvent.click(screen.getByText(en.submitButton));

    await waitFor(() => {
      // Check that the form was submitted and the modal closed
      expect(screen.queryByText(en.submitButton)).not.toBeInTheDocument();
      expect(assetService.createAsset).toHaveBeenCalled();
    });
  });
});
