import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useProjectStore = create(
  persist(
    (set, get) => ({
      selectedProjectId: null,
      setSelectedProjectId: (projectId) => {
        set({ selectedProjectId: projectId });
      },
      getSelectedProjectId: () => get().selectedProjectId,
    }),
    {
      name: 'project-store', 
      getStorage: () => sessionStorage, 
    }
  )
);

export default useProjectStore;
