import useAuthStore from "../stores/useAuthStore";
import useDomainStore from "../stores/useDomainStore";
const API_BASE_URL =
  "http://" + useDomainStore.getState().domain + "/rest/individual/message";

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

const individualMessageService = {

  sendMessage: async (message) => {
    try {
      const response = await fetch(`${API_BASE_URL}`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(message),
        credentials: "include",
      });
      checkStatus(response);
      return response;
    } catch (error) {
      console.error("Error sending message:", error.message);
      throw error;
    }
  },
  fetchMessagesBetweenTwoUsers: async (userId, otherUserId) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/${userId}/${otherUserId}`,
        {
          method: "GET",
          headers: getAuthHeaders(),
          credentials: "include",
        }
      );
      checkStatus(response);
      return response;
    } catch (error) {
      console.error("Error fetching messages:", error.message);
      throw error;
    }
  },
  fetchReceivedMessages: async (userId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/received/${userId}`, {
        method: "GET",
        headers: getAuthHeaders(),
        credentials: "include",
      });
      checkStatus(response);
      return response;
    } catch (error) {
      console.error("Error fetching received messages:", error.message);
      throw error;
    }
  },
  fetchSentMessages: async (userId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/sent/${userId}`, {
        method: "GET",
        headers: getAuthHeaders(),
        credentials: "include",
      });
      checkStatus(response);
      return response;
    } catch (error) {
      console.error("Error fetching sent messages:", error.message);
      throw error;
    }
  }
      
    
  
  
};

export default individualMessageService;
