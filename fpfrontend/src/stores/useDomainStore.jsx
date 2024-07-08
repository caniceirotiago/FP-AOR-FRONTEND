import {create} from 'zustand';

const useDomainStore = create((set) => ({
    httpsDomain: "https://localhost:8080/FPBackend",
    wwsDomain: "wss://localhost:8080/FPBackend"
}));

export default useDomainStore;
