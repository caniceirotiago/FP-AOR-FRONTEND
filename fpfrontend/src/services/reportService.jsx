import useAuthStore from "../stores/useAuthStore";
import useDomainStore from "../stores/useDomainStore";
const API_BASE_URL =
  "http://" + useDomainStore.getState().domain + "/rest/reports";

  const getAuthHeaders = () => {
    return {
      Accept: "application/pdf",
      "Content-Type": "application/json",
    };
  };

const checkStatus = (response) => {
  if (response.status === 401) {
    useAuthStore.getState().logout();
  }
};

const reportService = {
  
  generatePdfReport: async (element) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${element}/summary/pdf`, {
        method: "GET",
        headers: getAuthHeaders(),
        credentials: "include",
      });
      checkStatus(response);
      return response;
    } catch (error) {
      console.error("Error creating project report pdf:", error.message);
      throw error;
    }
  },
  getProjectSummary: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/project/summary`, {
        method: "GET",
        headers: getAuthHeaders(),
        credentials: "include",
      });
      checkStatus(response);
      return response.json();
    } catch (error) {
      console.error("Error fetching project summary:", error.message);
      throw error;
    }
  },
  getAssetSummary: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/asset/summary`, {
        method: "GET",
        headers: getAuthHeaders(),
        credentials: "include",
      });
      checkStatus(response);
      return response.json();
    } catch (error) {
      console.error("Error fetching asset summary:", error.message);
      throw error;
    }
  },

};

export default reportService;
