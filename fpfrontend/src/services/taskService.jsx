import useAuthStore from "../stores/useAuthStore";
import useDomainStore from "../stores/useDomainStore";
const API_BASE_URL =
  "http://" + useDomainStore.getState().domain + "/rest/tasks";

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

  getTasksByProjectId: async (projectId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/project/${projectId}`, {
        method: "GET",
        headers: getAuthHeaders(),
        credentials: "include",
      });
      checkStatus(response);
      return response;
    } catch (error) {
      console.error("Error fetching project tasks:", error.message);
      throw error;
    }
  },
  updateTask: async (taskId, task, projectId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${projectId}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(task),
        credentials: "include",
      });
      checkStatus(response);
      return response;
    } catch (error) {
      console.error("Error updating task:", error.message);
      throw error;
    }
  },
  addPrerequisiteTask: async (independentTaskId, dependentTaskId, projectId) => {
    const body = {
      mainTaskId: independentTaskId,
      dependentTaskId: dependentTaskId
    }
    console.log("sending body ", body)
    try {
      const response = await fetch(`${API_BASE_URL}/add/dependency/${projectId}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        credentials: "include",
        body: JSON.stringify(body),
      });
      checkStatus(response);
      return response;
    } catch (error) {
      console.error("Error adding prerequisite task:", error.message);
      throw error;
    }
  },
  removeDependency: async (independentTaskId, dependentTaskId, projectId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/dependency/${projectId}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
        credentials: "include",
        body: JSON.stringify({ mainTaskId: independentTaskId, dependentTaskId: dependentTaskId }),
      });
      checkStatus(response);
      return response;
    } catch (error) {
      console.error("Error removing dependency:", error.message);
      throw error;
    }
  }

    
  
  
};

export default projectService;
