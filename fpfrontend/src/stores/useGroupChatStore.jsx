// src/stores/useGroupChatStore.js
import {create} from 'zustand';

const useGroupChatStore = create((set) => ({
    isGroupChatModalOpen: false,
    selectedChatProject: null,
    openGroupChatModal: () => set({ isGroupChatModalOpen: true }),
    closeGroupChatModal: () => set({ isGroupChatModalOpen: false }),
    setSelectedChatProject: (project) => set({ selectedChatProject: project }),
    reset: () => set({ isGroupChatModalOpen: false, selectedChatProject: null }),
}));

export default useGroupChatStore;




