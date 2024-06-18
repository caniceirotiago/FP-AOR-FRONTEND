import {create} from 'zustand';

const useNotificationStore = create((set) => ({
    notification: [], 
    setNotification: (notifications) => set({ notification: notifications }),
    addNotification: () => {
        
    },
    removeNotification: () => {
       
    },
    clearNotifications: () => set({ notificationMap: [] }),
}));

export default useNotificationStore;
