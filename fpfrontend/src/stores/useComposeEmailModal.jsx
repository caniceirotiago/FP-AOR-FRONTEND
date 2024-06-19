import {create} from 'zustand';



const useComposeEmailModal = create((set) => ({
  isComposeModalOpen: false,
  selectedUser: null,
    setComposeModalOpen: (isOpen) => set({ isComposeModalOpen: isOpen }),
    setSelectedUser: (user) => set({ selectedUser: user }),
}));

export default useComposeEmailModal;
