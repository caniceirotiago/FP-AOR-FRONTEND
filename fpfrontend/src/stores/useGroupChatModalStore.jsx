import {create} from 'zustand';



const useGroupChatModalStore = create((set) => ({
  isGroupChatModalOpen: false,
  selectedChatProject: null,
  setGroupChatModalOpen: (isOpen) => set({ isGroupChatModalOpen: isOpen }),
  setSelectedChatProject: (project) => set({ selectedChatProject: project }),
}));

export default useGroupChatModalStore;
