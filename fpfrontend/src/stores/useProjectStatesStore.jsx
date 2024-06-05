import {create} from 'zustand';
import projectService from '../services/projectService';

const useProjectStatesStore = create((set) => ({
  states: [],
  loading: false,
  error: null,
  fetchProjectStates: async () => {
    set({ loading: true, error: null });
    try {
      const response = await projectService.fetchAllStates();
      const data = await response.json();
      set({ states: data, loading: false });
    } catch (error) {
      set({ error: 'Error fetching states', loading: false });
    }
  },
}));

export default useProjectStatesStore;
