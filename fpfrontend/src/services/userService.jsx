import Cookies from "js-cookie";
import useAuthStore from "../stores/useAuthStore";
import useDomainStore from "../stores/useDomainStore";
const API_BASE_URL = useDomainStore.getState().httpsDomain + "/rest/users";

const MEMBER_BASE_URL = useDomainStore.getState().httpsDomain + "/rest/memberships";



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
const removeInsecureCookies = () => {
  const allCookies = Cookies.get();
  for (const cookieName in allCookies) {
      Cookies.remove(cookieName, { path: '/' });
    
  }
};

const userService = {
  registerUser: async (userData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/register`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(userData),
      });
      return response;
    } catch (error) {
      console.error("Error registering user:", error.message);
      throw error;
    }
  },

  confirmAccount: async (token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/confirm?token=${token}`, {
        method: "PUT",
      });
      return response;
    } catch (error) {
      console.error("Error confirming account:", error.message);
      throw error;
    }
  },

  requestPasswordReset: async (email) => {
    try {
      const response = await fetch(`${API_BASE_URL}/request/password/reset`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({ email }),
      });
      return response;
    } catch (error) {
      console.error("Error fetching new password:", error);
      throw error;
    }
  },

  resetPassword: async (resetToken, newPassword) => {
    try {
      const response = await fetch(`${API_BASE_URL}/password/reset`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({ resetToken, newPassword }),
      });
      return response;
    } catch (error) {
      console.error("Erro na redefinição de senha:", error);
      throw error;
    }
  },

  login: async (email, password) => {
    let userLogin = { email, password };
    
    try {
      removeInsecureCookies();
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(userLogin),
        credentials: "include",
      });
      if(response.status === 401){
        Cookies.remove("sessionToken");
      }
      return response;
    } catch (error) {
      throw error;
    }
  },

  fetchUserBasicInfo: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/basic/info`, {
        method: "GET",
        headers: getAuthHeaders(),
        credentials: "include",
      });
      checkStatus(response);
      return response;
    } catch (error) {
      console.error("Error fetching user basic info:", error.message);
      throw error;
    }
  },

  fetchUserInfo: async (usernameProfile) => {
    try {
      const response = await fetch(`${API_BASE_URL}/info/${usernameProfile}`, {
        method: "GET",
        headers: getAuthHeaders(),
        credentials: "include",
      });
      checkStatus(response);
      return response;
    } catch (error) {
      console.error("Error fetching user info:", error.message);
      throw error;
    }
  },
  fetchUserBasicInfoByUsenameInfo: async (usernameProfile) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/basic/info/${usernameProfile}`,
        {
          method: "GET",
          headers: getAuthHeaders(),
          credentials: "include",
        }
      );
      checkStatus(response);
      return response;
    } catch (error) {
      console.error("Error fetching user basic info:", error.message);
      throw error;
    }
  },

  updateUser: async (updatedUser) => {
    try {
      const response = await fetch(`${API_BASE_URL}/profile`, {
        method: "PUT",
        headers: {
          Accept: "*/*",
          "Content-Type": "application/json",
          "Accept-Encoding": "gzip, deflate, br",
          Connection: "keep-alive",
        },
        credentials: "include",
        body: JSON.stringify(updatedUser),
      });
      checkStatus(response);
      return response;
    } catch (error) {
      console.error("Error updating user info:", error.message);
      throw error;
    }
  },

  updateUserPassword: async (oldPassword, newPassword) => {
    try {
      const response = await fetch(`${API_BASE_URL}/password`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          oldPassword: oldPassword,
          newPassword: newPassword,
        }),
        credentials: "include",
      });
      checkStatus(response);
      return response;
    } catch (error) {
      console.error("Error updating password:", error.message);
      throw error;
    }
  },

  requestNewConfirmationEmail: async (email) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/request/confirmation/email`,
        {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify({ email }),
        }
      );
      return response;
    } catch (error) {
      console.error("Erro ao solicitar novo e-mail de confirmação:", error);
      throw error;
    }
  },

  logout: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/logout`, {
        method: "POST",
        headers: getAuthHeaders(),
        credentials: "include",
      });
      checkStatus(response);
      return response;
    } catch (error) {
      throw error;
    }
  },

  checkSession: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/session/check`, {
        method: "GET",
        headers: getAuthHeaders(),
        credentials: "include",
      });
      checkStatus(response);
      return response;
    } catch (error) {
      console.error("Failed to check session", error);
      return false;
    }
  },

  addUserToProject: async (projectId, username) => {
    try {
      const response = await fetch(
        `${MEMBER_BASE_URL}/add/${username}/${projectId}`,
        {
          method: "POST",
          headers: getAuthHeaders(),
          credentials: "include",
        }
      );
      checkStatus(response);
      return response;
    } catch (error) {
      console.error("Error adding user to project:", error.message);
      throw error;
    }
  },

  removeUserFromProject: async (projectId, username) => {
    try {
      const response = await fetch(
        `${MEMBER_BASE_URL}/remove/${username}/${projectId}`,
        {
          method: "PUT",
          headers: getAuthHeaders(),
          credentials: "include",
        }
      );
      checkStatus(response);
      return response;
    } catch (error) {
      console.error("Error removing user from project:", error.message);
      throw error;
    }
  },

  confirmProjectAssociation: async (token, approve, approver) => {
    try {
      let url;
      if (approver) {
        url = `${MEMBER_BASE_URL}/confirm/project?token=${token}&approve=${approve}&approver=${approver}`;
      } else {
        url = `${MEMBER_BASE_URL}/accept/project?token=${token}&approve=${approve}`;
      }
      const response = await fetch(url, {
        method: "PUT",
        headers: getAuthHeaders(),
        credentials: "include",
      });
      checkStatus(response);
      return response;
    } catch (error) {
      console.error("Error confirming project association:", error.message);
      throw error;
    }
  },

  fetchUsersListBasicInfo: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/all/basic/info`, {
        method: "GET",
        headers: getAuthHeaders(),
        credentials: "include",
      });
      checkStatus(response);
      return response;
    } catch (error) {
      console.error("Error fetching users list basic info:", error.message);
      throw error;
    }
  },

  updateUserRole: async (updatedRole) => {
    try {
      const response = await fetch(`${API_BASE_URL}/role`, {
        method: "PUT",
        headers: getAuthHeaders(),
        credentials: "include",
        body: JSON.stringify(updatedRole),
      });
      return response;
    } catch (error) {
      console.error("Error updating user role:", error.message);
      throw error;
    }
  },
};

export default userService;
