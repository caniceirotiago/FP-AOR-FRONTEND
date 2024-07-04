import {create} from 'zustand';

const usePlanningPageStore = create((set) => ({
    isThePlanEditable: true,
    setIsThePlanEditable: (value) => set({ isThePlanEditable: value }),
}));
export default usePlanningPageStore;
