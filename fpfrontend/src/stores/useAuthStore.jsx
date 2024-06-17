import { create } from 'zustand';
import Cookies from 'js-cookie';
import {jwtDecode} from 'jwt-decode';

const isSessionTokenValid = () => {
  const sessionToken = Cookies.get('sessionToken');
  if (!sessionToken) return false;

  try {
    const decodedToken = jwtDecode(sessionToken);
    const currentTime = Date.now() / 1000; // em segundos
    return decodedToken.exp > currentTime;
  } catch (error) {
    console.error("Invalid session token format", error);
    return false;
  }
};


const useAuthStore = create((set, get) => ({
  isAuthenticated: !!Cookies.get('sessionToken'),
  login: () => {
    set({ isAuthenticated: true });
    startSessionCheck(); // Start session check on login
  },
  logout: () => {
    Cookies.remove('authToken', { path: '/' }); 
    Cookies.remove('sessionToken', { path: '/' });
    set({ isAuthenticated: false });
    localStorage.clear();
    stopSessionCheck(); // Stop session check on logout
  },
}));

// Timer for checking session validity
let sessionCheckInterval = null;

const startSessionCheck = () => {
  if (sessionCheckInterval) return; // Avoid multiple intervals

  sessionCheckInterval = setInterval(() => {
    if (!isSessionTokenValid()) {


    }
  }, 60000); // Check every minute
};

const stopSessionCheck = () => {
  if (sessionCheckInterval) {
    clearInterval(sessionCheckInterval);
    sessionCheckInterval = null;
  }
};

// Start session check on initial load
if (useAuthStore.getState().isAuthenticated) {
  startSessionCheck();
}

export default useAuthStore;
