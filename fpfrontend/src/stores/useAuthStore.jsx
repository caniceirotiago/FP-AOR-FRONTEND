import { create } from 'zustand';
import Cookies from 'js-cookie';

const isSessionTokenValid = () => {
  const sessionToken = Cookies.get('sessionToken');
  if (!sessionToken) return false;

  try {
    const decodedToken = atob(sessionToken);
    const [uuid, expirationTime] = decodedToken.split(':');
    const currentTime = Date.now();
    return currentTime < parseInt(expirationTime, 10);
  } catch (error) {
    console.error("Invalid session token format", error);
    return false;
  }
};

const useAuthStore = create((set, get) => ({
  isAuthenticated: !!Cookies.get('sessionToken'), // operator !! converts to boolean 
  login: () => {
    set({ isAuthenticated: true });
    console.log("User logged in");
    startSessionCheck(); // Start session check on login
  },
  logout: () => {
    Cookies.remove('authToken', { path: '/' }); 
    Cookies.remove('sessionToken', { path: '/' });
    set({ isAuthenticated: false });
    localStorage.clear();
    console.log("User logged out");
    stopSessionCheck(); // Stop session check on logout
  },
}));

// Timer for checking session validity
let sessionCheckInterval = null;

const startSessionCheck = () => {
  if (sessionCheckInterval) return; // Avoid multiple intervals

  sessionCheckInterval = setInterval(() => {
    if (!isSessionTokenValid()) {
      useAuthStore.getState().logout();
    }
  }, 5000); // Check every 5 seconds
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
