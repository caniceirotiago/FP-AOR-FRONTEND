import useDomainStore from "../stores/useDomainStore";
const API_BASE_URL = "http://" + useDomainStore.getState().domain + "/rest/users";
/**
 * userService
 * Provides an interface to interact with the user-related backend services. It encapsulates
 * the API calls for various user operations such as fetching basic user information, fetching users with tasks,
 * updating user data, changing user passwords, and more. Each method in this service handles the
 * request to the specific endpoint, processes the response, and manages errors appropriately.
 * Note: All requests are authenticated using a token stored in sessionStorage.
 */

const getAuthHeaders = () => {
    const token = sessionStorage.getItem('token');
    return {
      Accept: "application/json",
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    };
  };

const userService = {
    fetchUserBasicInfo: async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/photoandname`, {
                method: "GET",
                headers: getAuthHeaders(),
            });
            if (!response.ok) {
                throw new Error('Failed to fetch user basic info');
            }

            const data = await response.json();
            return {
                photoUrl: data.photoUrl,
                name: data.name,
                role: data.role,
                username: data.username,
            };
        } catch (error) {
            console.error("Error fetching user basic info:", error.message);
            throw error;
        }
    },
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
    
};

export default userService;
