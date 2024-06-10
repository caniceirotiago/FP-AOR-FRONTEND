import {create} from 'zustand';
import assetService from '../services/assetService';

const useAssetTypeStore = create((set) => ({
  states: [],
  loading: false,
  error: null,
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

export default useAssetTypeStore;
