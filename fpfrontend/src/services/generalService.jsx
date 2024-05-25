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
      const response = await fetch(
        `${API_BASE_URL}${apiUrl}/user`,
        {
          method: "GET",
          headers: getAuthHeaders(),
          credentials: "include",
        }
      );

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
        const requestBody = {"name" : name};
        console.log("name: ", name);
        const url = `${API_BASE_URL}${apiUrl}`;
        console.log(url);
      const response = await fetch(
        `${API_BASE_URL}${apiUrl}/create`,
        {
          method: "POST",
          headers: getAuthHeaders(),
          credentials: "include",
          body: JSON.stringify(requestBody),
        }
      );
      console.log(response);
      return response;
    } catch (error) {
      console.error("Error fetching suggestions:", error.message);
      throw error;
    }
  },

};

export default generalService;


