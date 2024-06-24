// src/stores/useSelectQuantityModalStore.js
import {create} from 'zustand';

const useSelectQuantityModalStore = create((set) => ({
  showModal: false,
  usedQuantity: 1,
  resolver: null,
  setShowModal: (show) => set({ showModal: show }),
  setUsedQuantity: (quantity) => set({ usedQuantity: quantity }),
  resolveSelection: (usedQuantity) => set((state) => {
    if (state.resolver) {
      state.resolver(usedQuantity);
    }
    return { usedQuantity, resolver: null };
  }),
  waitForQuantity: () => {
    return new Promise((resolve) => {
      set({ resolver: resolve });
    });
  },
  reset: () => set({ showModal: false, usedQuantity: 1, resolver: null }),
}));

export default useSelectQuantityModalStore;