import useDomainStore from "../stores/useDomainStore";
const API_BASE_URL = useDomainStore.getState().httpsDomain + "/rest/";

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
      const response = await fetch(
        `${API_BASE_URL}${apiUrl}/project/${projectId}`,
        {
          method: "GET",
          headers: getAuthHeaders(),
          credentials: "include",
        }
      );

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

  fetchComposeEmailSuggestions: async (apiUrl, firstLetter) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}${apiUrl}/first/letter/email?value=${firstLetter}`,
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

  addItem: async (apiUrl, data, mainEntity, mainEntityId) => {
    if (mainEntity === "project") {
      data = { ...data, projectId: mainEntityId };
    }
    try {
      const response = await fetch(
        `${API_BASE_URL}${apiUrl}/add/${mainEntity}`,
        {
          method: "POST",
          headers: getAuthHeaders(),
          credentials: "include",
          body: JSON.stringify(data),
        }
      );
      return response;
    } catch (error) {
      console.error("Error adding item:", error.message);
      throw error;
    }
  },

  removeItem: async (apiUrl, id, mainEntity, projectId) => {
    console.log("removeItem", apiUrl, id, mainEntity, projectId);
    if(mainEntity === "project"  && apiUrl !== "user"){
      try {
        let requestBody = { id: id, projectId: projectId};
        const response = await fetch(
          `${API_BASE_URL}${apiUrl}/remove/${mainEntity}/${projectId}`,
          {
            method: "PUT",
            headers: getAuthHeaders(),
            credentials: "include",
            body: JSON.stringify(requestBody),
          }
        );
        return response;
      } catch (error) {
        console.error("Error removing item:", error.message);
        throw error;
      }
    } 
    else{
      try {
      let requestBody = { id: id };
      const response = await fetch(
        `${API_BASE_URL}${apiUrl}/remove/${mainEntity}`,
        {
          method: "PUT",
          headers: getAuthHeaders(),
          credentials: "include",
          body: JSON.stringify(requestBody),
        }
      );
      return response;
    } catch (error) {
      console.error("Error removing item:", error.message);
      throw error;
    }
    }
    
  },
};

export default generalService;
