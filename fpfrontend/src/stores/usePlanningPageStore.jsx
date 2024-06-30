import {create} from 'zustand';

const usePlanningPageStore = create((set, get) => ({
    isThePlanEditable: true,
    setIsThePlanEditable: (value) => set({ isThePlanEditable: value }),
}));
export default usePlanningPageStore;
