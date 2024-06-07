import {create} from 'zustand';

const useTableCardView = create((set) => ({
  view: '',
  setView: (view) => set({ view }),
}));

export default useTableCardView;
