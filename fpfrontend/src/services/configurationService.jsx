import useDomainStore from "../stores/useDomainStore";
import useAuthStore from "../stores/useAuthStore";
const API_BASE_URL =
  "http://" + useDomainStore.getState().domain + "/rest/configurations";

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

const configurationService = {
    getAllConfigurations: async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/all`, {
                method: "GET",
                headers: getAuthHeaders(),
            });
            return response;
        } catch (error) {
            console.error("Error fetching configurations:", error.message);
            throw error;
        }
    },

}
export default configurationService;