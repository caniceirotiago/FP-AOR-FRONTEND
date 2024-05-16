import {create} from 'zustand';


const LoginModalStore = create((set) => ({
  isLoginModalOpen: false,
    setIsLoginModalOpen: (isOpen) => set({ isLoginModalOpen: isOpen }),
}));

export default LoginModalStore;
