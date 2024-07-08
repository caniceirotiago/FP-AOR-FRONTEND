import useAuthStore from "../stores/useAuthStore";
import useDomainStore from "../stores/useDomainStore";
const API_BASE_URL = useDomainStore.getState().httpsDomain + "/rest/group/messages";

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

};

export default groupMessageService;
