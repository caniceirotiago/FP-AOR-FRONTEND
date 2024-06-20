import {create} from 'zustand';

const useNotificationStore = create((set) => ({
    notification: [], 
    setNotification: (notifications) => set({ notification: notifications }),
    addNotification: (newNotification) =>  set((state) => ({ notification: [...state.notification, newNotification] })),
    removeNotification: () => {
       
    },
    clearNotifications: () => set({ notification: [] }),
}));

export default useNotificationStore;
