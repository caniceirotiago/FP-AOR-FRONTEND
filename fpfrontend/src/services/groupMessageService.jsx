import useAuthStore from "../stores/useAuthStore";
import useDomainStore from "../stores/useDomainStore";
const API_BASE_URL = "http://" + useDomainStore.getState().domain + "/rest/group/messages";

const getAuthHeaders = () => {
  return {
    Accept: "application/json",
    "Content-Type": "application/json",
  };
};

const checkStatus = (response) => {
  if (response.status === 401) {
    useAuthStore.getState().logout();
  }
};

const groupMessageService = {
  sendGroupMessage: async (message) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${message.projectId}`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(message),
        credentials: "include",
      });
      checkStatus(response);
      return response;
    } catch (error) {
      console.error("Error sending group message:", error.message);
      throw error;
    }
  },

  getAllGroupMessages: async (projectId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${projectId}`, {
        method: "GET",
        headers: getAuthHeaders(),
        credentials: "include",
      });
      checkStatus(response);
      return response;
    } catch (error) {
      console.error("Error fetching group messages:", error.message);
      throw error;
    }
  },

  markMessagesAsRead: async (projectId, markReadDto) => {
    try {
      const response = await fetch(`${API_BASE_URL}/read/${projectId}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({ markReadDto }),
        credentials: "include",
      });
      checkStatus(response);
      return response.json();
    } catch (error) {
      console.error("Error marking messages as read:", error.message);
      throw error;
    }
  },

};

export default groupMessageService;
