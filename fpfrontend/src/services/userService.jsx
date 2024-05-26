import useAuthStore from "../stores/useAuthStore";
import useDomainStore from "../stores/useDomainStore";
const API_BASE_URL =
  "http://" + useDomainStore.getState().domain + "/rest/users";

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
    console.log(JSON.stringify({ resetToken, newPassword }));
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
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(userLogin),
        credentials: "include",
      });
      console.log(response);
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
  updateUser: async (updatedUser) => {
    console.log(updatedUser);
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
        const response = await fetch(`${API_BASE_URL}/request/confirmation/email`, {
            method: "POST",
            headers: getAuthHeaders(),
            body: JSON.stringify({ email }),
        });
        return response;
    } catch (error) {
        console.error("Erro ao solicitar novo e-mail de confirmação:", error);
        throw error;
    }
  },
  logout: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/logout`, {
        method: 'POST',
        headers: getAuthHeaders(),
        credentials: 'include',
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
  }
};

export default userService;
