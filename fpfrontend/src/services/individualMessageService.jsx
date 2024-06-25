import useAuthStore from "../stores/useAuthStore";
import useDomainStore from "../stores/useDomainStore";
const API_BASE_URL =
  "http://" + useDomainStore.getState().domain + "/rest/individual/messages";

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
  fetchFilteredMessages: async (userId, type, page, pageSize, filters) => {
    const params = new URLSearchParams({
        userId,
        type,
        page,
        pageSize,
        ...filters
    });
    console.log(params.toString());

    const response = await fetch(`${API_BASE_URL}/filter?${params.toString()}`,
        {
            method: "GET",
            headers: getAuthHeaders(),
            credentials: "include",
        }
    );

    return response.json();
  },
        
    
  
  
};

export default individualMessageService;
