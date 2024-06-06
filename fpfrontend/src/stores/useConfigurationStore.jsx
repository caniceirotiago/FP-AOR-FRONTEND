import {create} from 'zustand';
import configurationService from '../services/configurationService';

const useConfigurationStore = create((set) => ({
    configurations: new Map(),
  loading: false,
  error: null,
  fetchConfigurations: async () => {
    set({ loading: true, error: null });
    try {
      const response = await configurationService.getAllConfigurations();
      const data = await response.json();
      const configMap = new Map(data.map(config => [config.configKey, config.configValue]));
      set({ configurations: configMap, loading: false });
    } catch (error) {
      set({ error: 'Error fetching configs', loading: false });
    }
  },
}));

export default useConfigurationStore;
