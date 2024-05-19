import useDomainStore from "../stores/useDomainStore";
const API_BASE_URL = "http://" + useDomainStore.getState().domain + "/rest/users";


const getAuthHeaders = () => {
    return {
      Accept: "application/json",
      "Content-Type": "application/json",
    };
  };

const userService = {

    registerUser: async (userData) => {
        try {
            const response = await fetch(`${API_BASE_URL}/register`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                  },
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
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email }),
            });
            return response;
        } catch (error) {
            console.error("Error fetching new password:", error);
            throw error;
        }
    },
    resetPassword: async (resetToken, newPassword) => {
        console.log(JSON.stringify({ resetToken, newPassword }))
        try {
            const response = await fetch(`${API_BASE_URL}/password/reset`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ resetToken, newPassword }),
            });
            return response;
        } catch (error) {
            console.error("Erro na redefinição de senha:", error);
            throw error;
        }
    },
    login : async (email, password) => {
        let userLogin = { email, password };
        try {
            const response = await fetch(`${API_BASE_URL}/login`, {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userLogin),
            credentials: 'include'
            });
            return response;
        } catch (error) {
            throw error;
        }
    },
    fetchUserBasicInfo: async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/userBasicInfo`, {
                method: "GET",
                headers: getAuthHeaders(),
                credentials: 'include'
            });
            if (!response.ok) {
                throw new Error('Failed to fetch user basic info');
            }
            return response;
        } catch (error) {
            console.error("Error fetching user basic info:", error.message);
            throw error;
        }
    },
    fetchUserInfo: async (profileNickname) => {
        try {
            const response = await fetch(`${API_BASE_URL}/info/${profileNickname}`, {
                method: "GET",
                headers: getAuthHeaders(),
                credentials: 'include'
            });
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
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(updatedUser)
            });
            console.log(response);
            return response; 
        } catch (error) {
            console.error("Error updating user info:", error.message);
            throw error;
        }
    },
    
};

export default userService;
