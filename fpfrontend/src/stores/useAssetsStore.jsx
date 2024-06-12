import {create} from 'zustand';
import assetService from '../services/assetService';

const useAssetsStore = create((set) => ({
  states: [],
  loading: false,
  error: null,
  isEditModalOpen: false,
  setEditModalOpen: (isOpen) => set({ isEditModalOpen: isOpen }),
  fetchAssetTypes: async () => {
    set({ loading: true, error: null });
    try {
      const response = await assetService.fetchAllTypes();
      const data = await response.json();
      set({ types: data, loading: false });
    } catch (error) {
      set({ error: 'Error fetching types', loading: false });
    }
  },
}));

export default useAssetsStore;
