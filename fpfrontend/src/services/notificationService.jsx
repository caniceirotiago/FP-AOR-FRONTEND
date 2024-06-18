import useAuthStore from "../stores/useAuthStore";
import useDomainStore from "../stores/useDomainStore";
const API_BASE_URL =
  "http://" + useDomainStore.getState().domain + "/rest/notifications";


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
    markMessageNotificationsAsRead: async (userId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/markAsRead/${userId}`, {
                method: "PUT",
                headers: getAuthHeaders(),
            });
      
            if (response.ok) {
                console.log("Message notifications marked as read for user:", userId);
            } else {
                console.error("Failed to mark message notifications as read:", response.statusText);
            }
        } catch (error) {
            console.error("Network error when trying to mark message notifications as read:", error);
        }
    },


};

export { notificationService };
