import {create} from 'zustand';

/**
 * useThemeStore (Zustand Store)
 * Manages the theme state of the application, supporting light and dark modes.
 * It initializes the theme based on a value stored in localStorage, defaulting to 'light' 
 * if no stored value is found. This allows for persistence of the user's theme preference across sessions.
 */


const getInitialTheme = () => {
  const savedTheme = localStorage.getItem('theme');
  return savedTheme ? savedTheme : 'light';
};

const useThemeStore = create((set) => ({
  theme: getInitialTheme(), 
  toggleTheme: () => set((state) => {
    const newTheme = state.theme === 'light' ? 'dark' : 'light';
    localStorage.setItem('theme', newTheme);
    return { theme: newTheme };
  }),
}));

export default useThemeStore;
