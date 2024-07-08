import {create} from 'zustand';

const useDomainStore = create((set) => ({
    httpsDomain: "https://localhost:8443/FPBackend",
    wssDomain: "wss://localhost:8443/FPBackend"
}));

export default useDomainStore;
