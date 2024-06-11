import {create} from 'zustand';
import assetService from '../services/assetService';

const useAssetStore = create((set) => ({
  assets: [],
  loading: false,
  error: null,
  fetchAssets: async () => {
    set({ loading: true, error: null });
    try {
      const response = await assetService.getAllAssets();
      const data = await response.json();
      set({ assets: data, loading: false });
    } catch (error) {
      set({ error: 'Error fetching assets', loading: false });
    }
  },
}));

export default useAssetStore;
