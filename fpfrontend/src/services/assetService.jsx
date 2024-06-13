import useAuthStore from "../stores/useAuthStore";
import useDomainStore from "../stores/useDomainStore";
const API_BASE_URL =
  "http://" + useDomainStore.getState().domain + "/rest/assets";

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

const assetService = {
  createAsset: async (assetData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/create`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(assetData),
        credentials: "include",
      });
      checkStatus(response);
      return response;
    } catch (error) {
      console.error("Error creating project:", error.message);
      throw error;
    }
  },

  getAssetById: async (assetId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/id/${assetId}`, {
        method: "GET",
        headers: getAuthHeaders(),
        credentials: "include",
      });
      return response;
    } catch (error) {
      console.error("Error fetching assets:", error.message);
      throw error;
    }
  },

  fetchAllTypes: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/enum/types`, {
        method: "GET",
        headers: getAuthHeaders(),
        credentials: "include",
      });
      return response;
    } catch (error) {
      console.error("Error fetching asset types states:", error.message);
      throw error;
    }
  },
  
  updateAsset: async (assetData) => {  
    try {
      const response = await fetch(`${API_BASE_URL}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(assetData),
        credentials: "include",
      });
      checkStatus(response);
      return response;
    } catch (error) {
      console.error("Error updating project:", error.message);
      throw error;
    }
  },

  getAllAssets: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}`, {
        method: "GET",
        headers: getAuthHeaders(),
        credentials: "include",
      });
      return response;
    } catch (error) {
      console.error("Error fetching assets:", error.message);
      throw error;
    }
  },

  getFilteredAssets: async (page, pageSize, filters = {}) => {
    const filterParams = new URLSearchParams();
    Object.keys(filters).forEach(key => {
      if (filters[key]) {
        filterParams.append(key, filters[key]);
      }
    });
    filterParams.append('page', page);
  filterParams.append('pageSize', pageSize);
    try {
      const response = await fetch(`${API_BASE_URL}/all/filter?${filterParams}`,
        {
          method: "GET",
          headers: getAuthHeaders(),
          credentials: "include",
        }
      );
      return response;
    } catch (error) {
      console.error("Error fetching projects:", error.message);
      throw error;
    }
  },

};

export default assetService;
