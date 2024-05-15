import {create} from 'zustand';

const useDomainStore = create((set) => ({
    domain: "localhost:8080/FPBackend"
}));

export default useDomainStore;
