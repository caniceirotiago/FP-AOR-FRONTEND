import useDomainStore from "../stores/useDomainStore";
const API_BASE_URL = "http://" + useDomainStore.getState().domain + "/rest/";

const getAuthHeaders = () => {
  return {
    Accept: "application/json",
    "Content-Type": "application/json",
  };
};

const generalService = {
  fetchUserAttributes: async (apiUrl) => {
    try {
      const response = await fetch(`${API_BASE_URL}${apiUrl}/user`, {
        method: "GET",
        headers: getAuthHeaders(),
        credentials: "include",
      });

      console.log(response);
      if (response.status !== 200) {
        throw new Error("Failed to fetch inputs");
      }
      return response;
    } catch (error) {
      console.error("Error fetching inputs:", error.message);
      throw error;
    }
  },
  fetchProjectAttributes: async (apiUrl) => {
    try {
      const response = await fetch(`${API_BASE_URL}${apiUrl}/project`, {
        method: "GET",
        headers: getAuthHeaders(),
        credentials: "include",
      });

      console.log(response);
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

      console.log(response);
      if (response.status !== 200) {
        throw new Error("Failed to fetch suggestions");
      }
      return response;
    } catch (error) {
      console.error("Error fetching suggestions:", error.message);
      throw error;
    }
  },

  addItem: async (apiUrl, name) => {
    try {
      const requestBody = { name: name };
      const response = await fetch(`${API_BASE_URL}${apiUrl}/add/user`, {
        method: "POST",
        headers: getAuthHeaders(),
        credentials: "include",
        body: JSON.stringify(requestBody),
      });
      console.log(response);
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
      console.log(response);
      return response;
    } catch (error) {
      console.error("Error fetching suggestions:", error.message);
      throw error;
    }
  },
};

export default generalService;
