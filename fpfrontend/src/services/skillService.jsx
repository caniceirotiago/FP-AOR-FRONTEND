import useAuthStore from "../stores/useAuthStore";
import useDomainStore from "../stores/useDomainStore";
const API_BASE_URL =
  "http://" + useDomainStore.getState().domain + "/rest/skills";

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

const skillService = {

  removeItem: async (id, mainEntity, mainEntityId) => {
    try {
      let requestBody = { id: id, projectId: mainEntityId };
      const response = await fetch(
        `${API_BASE_URL}/remove/${mainEntity}/${mainEntityId}`,
        {
          method: "PUT",
          headers: getAuthHeaders(),
          credentials: "include",
          body: JSON.stringify(requestBody),
        }
      );
      return response;
    } catch (error) {
      console.error("Error fetching suggestions:", error.message);
      throw error;
    }
  },
      
    
};

export default skillService;
