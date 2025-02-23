import { create } from "zustand";
import { persist, type StorageValue } from "zustand/middleware";

interface SettingsState {
  highlightInput: boolean;
  theme: "dark" | "light" | "system";
  searchMode:
    | "quick-search" // Quick & less accurate
    | "medium-search" // Medium speed, 80% accurate
    | "slow-search"; // Slow but 100% accurate
}

interface SettingsStateActions {
  updateState(data: Partial<SettingsState>): void;
}

const STORE_KEY = "SETTINGS_STORE_NAME";

const useSettings = create<SettingsState & SettingsStateActions>()(
  persist(
    (setter) => ({
      credential: "",
      highlightInput: false,
      theme: "dark",
      searchMode: "medium-search",
      updateState(data) {
        setter((prevState) => ({ ...prevState, ...data }));
      },
    }),
    {
      name: STORE_KEY,
      storage: {
        removeItem(name) {
          chrome.storage.sync.remove(name);
        },
        async getItem(name) {
          const state = (await chrome.storage.sync.get(name))[
            name
          ] as SettingsState;

          return {
            state,
          };
        },
        setItem(name, { state }: StorageValue<SettingsState>) {
          const data: SettingsState = {
            highlightInput: state.highlightInput,
            theme: state.theme,
            searchMode: state.searchMode,
          };

          chrome.storage.sync.set({
            [name]: data,
          });
        },
      },
    }
  )
);

export const settingHelpers = {
  async getStore() {
    const store = (await chrome.storage.sync.get(STORE_KEY))?.[STORE_KEY];
    return store as SettingsState;
  },
};

export default useSettings;
