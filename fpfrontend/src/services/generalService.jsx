import useDomainStore from "../stores/useDomainStore";
const API_BASE_URL = "http://" + useDomainStore.getState().domain + "/rest/";

const getAuthHeaders = () => {
  return {
    Accept: "application/json",
    "Content-Type": "application/json",
  };
};

const generalService = {
  fetchUserAttributes: async (apiUrl, user) => {
    try {
      const response = await fetch(`${API_BASE_URL}${apiUrl}/user/${user}`, {
        method: "GET",
        headers: getAuthHeaders(),
        credentials: "include",
      });

      if (response.status !== 200) {
        throw new Error("Failed to fetch inputs");
      }
      return response;
    } catch (error) {
      console.error("Error fetching inputs:", error.message);
      throw error;
    }
  },
  fetchProjectAttributes: async (apiUrl, projectId) => {
    try {
      const response = await fetch(`${API_BASE_URL}${apiUrl}/project/${projectId}`, {
        method: "GET",
        headers: getAuthHeaders(),
        credentials: "include",
      });

      if (response.status !== 200) {
        throw new Error("Failed to fetch inputs");
      }
      return response;
    } catch (error) {
      console.error("Error fetching inputs:", error.message);
      throw error;
    }
  },

  fetchSuggestions: async (apiUrl, firstLetter) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}${apiUrl}/first/letter?value=${firstLetter}`,
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
  },

  addItem: async (apiUrl, data) => {
    try {
      const response = await fetch(`${API_BASE_URL}${apiUrl}/add/user`, {
        method: "POST",
        headers: getAuthHeaders(),
        credentials: "include",
        body: JSON.stringify(data),
      });
      return response;
    } catch (error) {
      console.error("Error fetching suggestions:", error.message);
      throw error;
    }
  },

  removeItem: async (apiUrl, id) => {
    try {
      const requestBody = { id: id };
      const response = await fetch(`${API_BASE_URL}${apiUrl}/remove/user`, {
        method: "PUT",
        headers: getAuthHeaders(),
        credentials: "include",
        body: JSON.stringify(requestBody),
      });
      return response;
    } catch (error) {
      console.error("Error fetching suggestions:", error.message);
      throw error;
    }
  },
};

export default generalService;
