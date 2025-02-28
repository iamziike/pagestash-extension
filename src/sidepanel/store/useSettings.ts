import { create } from "zustand";
import { persist, type StorageValue } from "zustand/middleware";

export type CredentialStore = {
  apiKey: string;
  type: "gemini" | "openai";
  isDefault?: boolean;
};

export interface SettingsState {
  credential: {
    apiKey: string;
    type: "gemini" | "openai";
    isDefault?: boolean;
  } | null;
  highlightInput: boolean;
  theme: "dark" | "light" | "system";
}

interface SettingsStateActions {
  reset(): void;
  updateState(data: Partial<SettingsState>): void;
  getDefault(): SettingsState;
}

const STORE_KEY = "SETTINGS_STORE_NAME";

export const DEFAULT_CREDENTIAL: SettingsState["credential"] = {
  isDefault: true,
  apiKey: import.meta.env.VITE_AI_API_KEY as string,
  type: import.meta.env.VITE_AI_PROVIDER,
};

const useSettings = create<SettingsState & SettingsStateActions>()(
  persist(
    (setter) => {
      const getDefault = () => {
        return {
          credential: DEFAULT_CREDENTIAL,
          highlightInput: false,
          theme: "dark",
        } as const;
      };

      return {
        ...getDefault(),
        getDefault,
        updateState(data) {
          setter((prevState) => ({ ...prevState, ...data }));
        },
        reset() {
          setter(() => getDefault());
        },
      };
    },
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
            credential: state.credential && {
              ...state.credential,
              isDefault: state.credential.apiKey === DEFAULT_CREDENTIAL.apiKey,
            },
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

export const settingHelpers = {
  async getStore() {
    const store = (await chrome.storage.sync.get(STORE_KEY))?.[STORE_KEY];
    return {
      ...store,
      credential: store?.credential || DEFAULT_CREDENTIAL,
    } as SettingsState;
  },
};

export default useSettings;
