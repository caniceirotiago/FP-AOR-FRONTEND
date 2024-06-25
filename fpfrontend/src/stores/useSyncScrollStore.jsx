import {create} from 'zustand';

const useSyncScrollStore = create((set) => ({
  syncScrollPosition: { scrollX: 0, scrollY: 0 },
  setSyncScrollPosition: (syncScrollPosition) => set({ syncScrollPosition }),
}));

export default useSyncScrollStore;