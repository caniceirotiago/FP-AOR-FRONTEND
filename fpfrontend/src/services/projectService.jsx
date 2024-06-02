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
  fetchAllStates: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/info/project-states`, {
        method: "GET",
        headers: getAuthHeaders(),
      });
      return response;
    } catch (error) {
      console.error("Error fetching project states:", error.message);
      throw error;
    }
  },
  fetchProjectRoles: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/info/project-roles`, {
        method: "GET",
        headers: getAuthHeaders(),
      });
      return response;
    } catch (error) {
      console.error("Error fetching project roles:", error.message);
      throw error;
    }
  },
  updateProjecUserRole: async (projectId, userId, role) => {
    const body = {
      projectId,
      userId,
      role,
    };
    try {
      const response = await fetch(
        `${API_BASE_URL}/project-role`,
        {
          method: "PUT",
          headers: getAuthHeaders(),
          body: JSON.stringify(body),
        }
      );
      checkStatus(response);
      return response;
    } catch (error) {
      console.error("Error updating user role:", error.message);
      throw error;
    }
  }
  
};

export default projectService;
