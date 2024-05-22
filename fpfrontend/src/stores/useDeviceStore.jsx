import { create } from 'zustand';

const useDeviceStore = create((set) => ({
  dimensions: {
    width: window.innerWidth,
    height: window.innerHeight
  },
  isTouch: false, 
  deviceType: null,

  setDimensions: (width, height) => set({ dimensions: { width, height } }),
  setDeviceType: (type) => set({ deviceType: type }),
  setIsTouch: (isTouch) => set({isTouch: isTouch}),
}));

function updateTouchCapability() {
  const handleFirstTouch = () => {
    useDeviceStore.setState({ isTouch: true });
    window.removeEventListener('touchstart', handleFirstTouch, false);
    console.log("Touch capability set:", useDeviceStore.getState().isTouch); 
  };

  window.addEventListener('touchstart', handleFirstTouch, false);
}

updateTouchCapability();

export default useDeviceStore;
