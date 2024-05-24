import useDomainStore from "../stores/useDomainStore";
const API_BASE_URL = "http://" + useDomainStore.getState().domain + "/rest/labs";

const getAuthHeaders = () => {
    return {
      "Accept": "application/json",
      "Content-Type": "application/json",
    };
  };


const labService = {
    fetchAllLabs: async () => {
        try {
            const response = await fetch(`${API_BASE_URL}`, {
                method: "GET",
                headers: getAuthHeaders(),
            });
            console.log(response);
            if (response.status !== 200) {
                throw new Error('Failed to fetch labs info');
            }
            return response;
        } catch (error) {
            console.error("Error fetching lab info:", error.message);
            throw error;
        }
    },
    
};

export default labService;
