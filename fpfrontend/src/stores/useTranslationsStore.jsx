import { create } from 'zustand';

const useTranslationsStore = create((set) => ({
    locale: localStorage.getItem('locale') || "en",

    updateLocale: (locale) => {
        localStorage.setItem('locale', locale); 
        set({ locale }); 
    }
}));

export default useTranslationsStore;
