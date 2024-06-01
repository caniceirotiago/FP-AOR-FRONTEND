import useAuthStore from "../stores/useAuthStore";
import useDomainStore from "../stores/useDomainStore";
const API_BASE_URL =
  "http://" + useDomainStore.getState().domain + "/rest/projects";

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

const projectService = {
  createProject: async (projectData) => {
    console.log(JSON.stringify(projectData));
    try {
      const response = await fetch(`${API_BASE_URL}/create`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(projectData),
        credentials: "include",
      });
      checkStatus(response);
      return response;
    } catch (error) {
      console.error("Error creating project:", error.message);
      throw error;
    }
  },
  getAllProjects: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/all`, {
        method: "GET",
        headers: getAuthHeaders(),
      });
      return response;
    } catch (error) {
      console.error("Error fetching projects:", error.message);
      throw error;
    }
  },
  getFilteredProjects: async (page, pageSize, filters = {}) => {
    const filterParams = new URLSearchParams({
      ...filters,
      page,
      pageSize
    }).toString();
    try {
      const response = await fetch(`${API_BASE_URL}/all/filter?${filterParams}`,
        {
          method: "GET",
          headers: getAuthHeaders(),
        }
      );
      return response;
    } catch (error) {
      console.error("Error fetching projects:", error.message);
      throw error;
    }
  },
  getProjectById: async (projectId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/info/${projectId}`, {
        method: "GET",
        headers: getAuthHeaders(),
        credentials: "include",
      });
      checkStatus(response);
      return response;
    } catch (error) {
      console.error("Error fetching project data:", error.message);
      throw error;
    }
  },
  
};

export default projectService;
