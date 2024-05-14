import { create } from 'zustand';

const useTranslationsStore = create((set) => ({
    locale: sessionStorage.getItem('locale') || "en",

    updateLocale: (locale) => {
        sessionStorage.setItem('locale', locale); 
        set({ locale }); 
    }
}));

export default useTranslationsStore;
