
import {create} from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * useLayoutStore (Zustand Store)
 * Manages layout-related state within the application, specifically for handling
 * the expansion state of a sidebar or aside element. This store provides a simple,
 * centralized way to toggle the visibility or expanded state of UI components like
 * sidebars, which can enhance user experience in applications with responsive or
 * adjustable layouts.
 */


const useLayoutStore = create(
  persist(
    (set) => ({
      selectedView: 'table',
      isAsideExpanded: true,
      toggleAside: () => set((state) => ({ isAsideExpanded: !state.isAsideExpanded })),
      setSelectedView: (view) => set(() => ({ selectedView: view })),
    }),
    {
      name: 'layout-storage', 
      getStorage: () => localStorage, 
    }
  )
);

export default useLayoutStore;
