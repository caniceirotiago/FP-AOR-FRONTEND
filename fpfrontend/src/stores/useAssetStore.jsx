import {create} from 'zustand';
import assetService from '../services/assetService';

const useAssetStore = create((set) => ({
  assets: [],
  selectedAsset: null,
  setSelectedAsset: (asset) => set({ selectedAsset: asset }),

  loading: false,
  error: null,
  fetchAssets: async () => {
    set({ loading: true, error: null });
    console.log("Fetching assets...");
    try {
      const response = await assetService.getAllAssets();
      const data = await response.json();
      console.log("Assets fetched:", data);
      set({ assets: data, loading: false });
    } catch (error) {
      console.error("Error fetching assets:", error);
      set({ error: 'Error fetching assets', loading: false });
    }
  },
}));

export default useAssetStore;