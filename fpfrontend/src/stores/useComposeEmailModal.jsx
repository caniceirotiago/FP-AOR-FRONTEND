import { create } from 'zustand';

const useComposeEmailModal = create((set) => ({
  isComposeModalOpen: false,
  selectedUser: null,
  selectedMessage: null,
  setComposeModalOpen: (isOpen) => set({ isComposeModalOpen: isOpen }),
  setSelectedUser: (user) => set({ selectedUser: user }),
  setSelectedMessage: (message) => set({ selectedMessage: message }),
}));

export default useComposeEmailModal;
