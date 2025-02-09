import { create } from "zustand";
import { persist, type StorageValue } from "zustand/middleware";

interface SettingsState {
  credential: string;
  highlightInput: boolean;
  theme: "dark" | "light" | "system";
}

interface SettingsStateActions {
  updateState(data: Partial<SettingsState>): void;
}

const SETTINGS_STORE_NAME = "SETTINGS_STORE_NAME";

const settings = create<SettingsState & SettingsStateActions>()(
  persist(
    (setter) => ({
      credential: "",
      highlightInput: false,
      theme: "dark",
      updateState(data) {
        setter((prevState) => ({ ...prevState, ...data }));
      },
    }),
    {
      name: SETTINGS_STORE_NAME,
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
            credential: state.credential,
            highlightInput: state.highlightInput,
            theme: state.theme,
          };

          chrome.storage.sync.set({
            [name]: data,
          });
        },
      },
    }
  )
);

export default settings;
