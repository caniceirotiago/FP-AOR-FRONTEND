import useAuthStore from "../stores/useAuthStore";
import useDomainStore from "../stores/useDomainStore";
const API_BASE_URL =
  "http://" + useDomainStore.getState().domain + "/rest/projects";

  const MEMBER_BASE_URL =
  "http://" + useDomainStore.getState().domain + "/rest/memberships";

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
      const response = await fetch(`${API_BASE_URL}/enum/states`, {
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
      const response = await fetch(`${API_BASE_URL}/enum/roles`, {
        method: "GET",
        headers: getAuthHeaders(),
      });
      return response;
    } catch (error) {
      console.error("Error fetching project roles:", error.message);
      throw error;
    }
  },

  updateProjecUserRole: async (projectId, userId, newRole) => {
    const body = {
      userId,
      newRole,
    };
    try {
      const response = await fetch(
        `${API_BASE_URL}/role/${projectId}`,
        {
          method: "PUT",
          headers: getAuthHeaders(),
          body: JSON.stringify(body),
          credentials: "include"
        }
      );
      checkStatus(response);
      return response;
    } catch (error) {
      console.error("Error updating user role:", error.message);
      throw error;
    }
  },

  askToJoinProject: async (projectId) => {
    try {
      const response = await fetch(
        `${MEMBER_BASE_URL}/ask/join/${projectId}`,
        {
          method: "PUT",
          headers: getAuthHeaders(),
          credentials: "include",
        }
      );
      checkStatus(response);
      return response;
    } catch (error) {
      console.error("Error asking to join project:", error.message);
      throw error;
    }
  },

  updateProject: async (projectId, projectData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${projectId}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(projectData),
        credentials: "include",
      });
      checkStatus(response);
      return response;
    } catch (error) {
      console.error("Error updating project:", error.message);
      throw error;
    }
  },

  getTasksByProjectId: async (projectId) => {
    try {
      const response = await fetch(`http://localhost:8080/FPBackend/rest/tasks/project/${projectId}`, {
        method: "GET",
        headers: getAuthHeaders(),
        credentials: "include",
      });
      checkStatus(response);
      return response;
    } catch (error) {
      console.error("Error updating project:", error.message);
      throw error;
    }
  },
  approveOrRejectProject: async (projectId, comment, confirm) => {
    const body = {
      projectId,
      comment,
      confirm,
    };
    try {
      const response = await fetch(`${API_BASE_URL}/approve`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(body),
        credentials: "include",
      });
      checkStatus(response);
      return response;
    } catch (error) {
      console.error("Error approving or rejecting project:", error.message);
      throw error;
    }
  },
  getProjectLogsByProjectId: async (projectId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/logs/${projectId}`, {
        method: "GET",
        headers: getAuthHeaders(),
        credentials: "include",
      });
      checkStatus(response);
      return response;
    } catch (error) {
      console.error("Error fetching project logs:", error.message);
      throw error;
    }
  },
  
      
    
  
  
};

export default projectService;
