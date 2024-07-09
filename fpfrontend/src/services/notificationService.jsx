import useAuthStore from "../stores/useAuthStore";
import useDomainStore from "../stores/useDomainStore";
const API_BASE_URL = useDomainStore.getState().httpsDomain + "/rest/notifications";


const getAuthHeaders = () => {
  return {
    "Accept": "application/json",
    "Content-Type": "application/json",
  };
};

const checkStatus = (response) => {
  if (response.status === 401) {
    useAuthStore.getState().logout();
  }
};

const notificationService = {
    getUserNotifications: async () => {
        try {
            const response = await fetch(`${API_BASE_URL}`, {
                method: "GET",
                headers: getAuthHeaders(),
                credentials: "include",
            });
      
            if (response.ok) {
                const notifications = await response.json();
                return notifications;
            } else {
                console.error("Failed to load motifications:", response.statusText);
                return [];
            }
        } catch (error) {
            console.error("Network error when trying to load notifications:", error);
            return [];
        }
    },
    markNotificationsAsRead: async (notifId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/mark/as/read/${notifId}`, {
                method: "PUT",
                headers: getAuthHeaders(),
                credentials: "include",
            });
      
            if (response.ok) {
                console.log("Notification marked as read successfully");
            } else {
                console.error("Failed to mark notifications as read:", response.statusText);
            }
        } catch (error) {
            console.error("Network error when trying to mark notifications as read:", error);
        }
    },


};

export { notificationService };
