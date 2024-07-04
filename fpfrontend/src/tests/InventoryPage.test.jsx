import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { useIntl } from 'react-intl';
import InventoryPage from '../pages/InventoryPage/InventoryPage';
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
    useIntl: () => ({ formatMessage: jest.fn() }),
  }));
  

jest.mock('../services/assetService');
jest.mock('../stores/useAssetsStore');

// Mock asset data
const mockAssets = [
  { id: 1, name: 'Asset 1', type: 'RESOURCE', description: 'Description of Asset 1', stockQuantity: 12, partNumber: 'PartNumber1', manufacturer: 'Manufacturer A', manufacturerPhone:'239456789', observations:'Observations for Asset 1'},
  { id: 2, name: 'Asset 2', type: 'COMPONENT', description: 'Description of Asset 2', stockQuantity: 8, partNumber: 'PartNumber2', manufacturer: 'Manufacturer B', manufacturerPhone:'239456789', observations:'Observations for Asset 2'},
];

describe('InventoryPage', () => {
    beforeEach(() => {
      // Mock the fetchAssetTypes method correctly
      useAssetsStore.mockReturnValue({
        fetchAssetTypes: jest.fn().mockResolvedValue({
          status: 200,
          json: async () => (['RESOURCE', 'COMPONENT']), // Mocked response data
        }),
        // Add other mocked state or methods as needed
        types: [], // If types is accessed in your component
        isEditModalOpen: false, // Example of another state
        setEditModalOpen: jest.fn(), // Example of another method
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

  test('renders InventoryPage component', async () => {
    render(
      <Router>
        <InventoryPage />
      </Router>
    );

    expect(screen.getByText(/create asset/i)).toBeInTheDocument();
    expect(screen.getByText(/filter/i)).toBeInTheDocument();
    expect(screen.getByText(/asset 1/i)).toBeInTheDocument();
    expect(screen.getByText(/asset 2/i)).toBeInTheDocument();
  });

  test('opens create asset modal on button click', async () => {
    render(
      <Router>
        <InventoryPage />
      </Router>
    );

    fireEvent.click(screen.getByText(/create asset/i));
    expect(screen.getByText(/create asset modal/i)).toBeInTheDocument();
  });

  test('toggles filter visibility on button click', async () => {
    render(
      <Router>
        <InventoryPage />
      </Router>
    );

    expect(screen.queryByText(/filters/i)).not.toBeInTheDocument();
    fireEvent.click(screen.getByText(/filter/i));
    expect(screen.getByText(/filters/i)).toBeInTheDocument();
  });

  test('updates asset list based on filters', async () => {
    render(
      <Router>
        <InventoryPage />
      </Router>
    );

    fireEvent.change(screen.getByPlaceholderText(/name/i), {
      target: { value: 'Asset 1' },
    });
    fireEvent.click(screen.getByText(/filter/i));

    await waitFor(() => {
      expect(assetService.getFilteredAssets).toHaveBeenCalledWith(
        1,
        10,
        { name: 'Asset 1', type: '', manufacturer: '', partNumber: '', sortBy: '', orderBy: '' }
      );
    });

    expect(screen.getByText(/asset 1/i)).toBeInTheDocument();
    expect(screen.queryByText(/asset 2/i)).not.toBeInTheDocument();
  });

  test('handles pagination', async () => {
    render(
      <Router>
        <InventoryPage />
      </Router>
    );

    fireEvent.click(screen.getByText('>'));
    expect(screen.getByText(/page 2 of/i)).toBeInTheDocument();
  });
});
