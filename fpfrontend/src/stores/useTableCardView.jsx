import {create} from 'zustand';

const useTableCardView = create((set) => ({
  view: 'table',
  setView: (view) => set({ view }),
}));

export default useTableCardView;
