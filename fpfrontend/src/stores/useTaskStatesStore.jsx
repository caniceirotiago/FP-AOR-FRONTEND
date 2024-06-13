import {create} from 'zustand';
import taskService from '../services/taskService';

const useTaskStatesStore = create((set) => ({
  states: [],
  loading: false,
  error: null,
  fetchTaskStates: async () => {
    set({ loading: true, error: null });
    try {
      const response = await taskService.fetchAllStates();
      const data = await response.json();
      set({ states: data, loading: false });
    } catch (error) {
      set({ error: 'Error fetching states', loading: false });
    }
  },
}));

export default useTaskStatesStore;
