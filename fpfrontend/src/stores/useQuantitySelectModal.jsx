// src/stores/useQuantitySelectModal.js
import {create} from 'zustand';

const useQuantitySelectModal = create((set) => ({
  showModal: false,
  quantity: null,
  resolver: null,
  setShowModal: (show) => set({ showModal: show }),
  setQuantity: (quantity) => set((state) => {
    if (state.resolver) {
      state.resolver(quantity);
    }
    return { quantity, resolver: null };
  }),
  waitForQuantity: () => {
    return new Promise((resolve) => {
      set({ resolver: resolve });
    });
  },
  reset: () => set({ showModal: false, quantity: null, resolver: null }),
}));

export default useQuantitySelectModal;
