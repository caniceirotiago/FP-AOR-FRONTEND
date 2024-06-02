import {create} from 'zustand';
import projectService from '../services/projectService';

const useProjectRolesStore = create((set) => ({
  roles: [],
  loading: false,
  error: null,
  fetchProjectRoles: async () => {
    set({ loading: true, error: null });
    try {
      const response = await projectService.fetchProjectRoles();
      const data = await response.json();
      set({ roles: data, loading: false });
    } catch (error) {
      set({ error: 'Error fetching proj roles', loading: false });
    }
  },
}));

export default useProjectRolesStore;
