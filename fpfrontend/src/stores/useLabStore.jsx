import {create} from 'zustand';
import labService from '../services/labService';

const useLabStore = create((set) => ({
  laboratories: [],
  loading: false,
  error: null,
  fetchLaboratories: async () => {
    set({ loading: true, error: null });
    try {
      const response = await labService.fetchAllLabs();
      const data = await response.json();
      set({ laboratories: data, loading: false });
    } catch (error) {
      set({ error: 'Error fetching labs', loading: false });
    }
  },
}));

export default useLabStore;
