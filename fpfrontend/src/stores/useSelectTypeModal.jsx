// src/stores/useSelectTypeModal.js
import {create} from 'zustand';

const useSelectTypeModal = create((set) => ({
  showModal: false,
  options: [],
  selectedOption: null,
  resolver: null,
  setShowModal: (show) => set({ showModal: show }),
  setOptions: (options) => set({ options }),
  setSelectedOption: (option) => set((state) => {
    if (state.resolver) {
      state.resolver(option);
    }
    return { selectedOption: option, resolver: null };
  }),
  waitForSelection: () => {
    return new Promise((resolve) => {
      set({ resolver: resolve });
    });
  },
  reset: () => set({ showModal: false, options: [], selectedOption: null, resolver: null }),
}));

export default useSelectTypeModal;
