import {create} from 'zustand';

const useProjectStore = create((set) => ({
  selectedProjectId: null,
  setSelectedProjectId: (projectId) => set({ selectedProjectId: projectId }),
}));

export default useProjectStore;
