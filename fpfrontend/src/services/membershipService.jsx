import useAuthStore from "../stores/useAuthStore";
import useDomainStore from "../stores/useDomainStore";

const MEMBER_BASE_URL = useDomainStore.getState().httpsDomain + "/rest/memberships";

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

const membershipService = {

    getProjectsByuserId: async (userId) => {
        try {
            const response = await fetch(`${MEMBER_BASE_URL}/projectIds/byUserId/${userId}`, {
                method: "GET",
                headers: getAuthHeaders(),
                credentials: "include",
            });
            checkStatus(response);
            return response;
        } catch (error) {
            console.error("Error fetching projects:", error.message);
            throw error;
        }
    },
    fetchSuggestionsByProjectId: async (firstLetter, projectId) => {
      try {
        const response = await fetch(`${MEMBER_BASE_URL}/first/letter/${projectId}?value=${firstLetter}`,
          {
            method: "GET",
            headers: getAuthHeaders(),
            credentials: "include",
          }
        );
  
        if (response.status !== 200) {
          throw new Error("Failed to fetch suggestions");
        }
        return response;
      } catch (error) {
        console.error("Error fetching suggestions:", error.message);
        throw error;
      }
    }
    


  
};

export default membershipService;
