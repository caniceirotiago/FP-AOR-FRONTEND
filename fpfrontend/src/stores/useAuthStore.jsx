import { create } from 'zustand';
import Cookies from 'js-cookie';

const useAuthStore = create((set) => ({
  isAuthenticated: !!Cookies.get('authToken'), // operator !! converts to boolean 
  login: () => {
    set({ isAuthenticated: true });
    console.log("User logged in");
  },
  logout: () => {
    Cookies.remove('authToken', { path: '/' }); 
    set({ isAuthenticated: false });
    sessionStorage.clear();
    console.log("User logged out");
  },
}));

export default useAuthStore;
