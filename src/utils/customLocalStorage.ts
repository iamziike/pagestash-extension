import { StorageValue } from "zustand/middleware";

interface Args {
  storeKey: string;
}

const customLocalStorage = <T extends { data: Record<string, unknown> }>({
  storeKey,
}: Args) => {
  const name = storeKey;

  return {
    name,
    storage: {
      async removeItem(name: string) {
        chrome.storage.sync.remove(name);
      },
      async getItem(name: string) {
        const state = (await chrome.storage.sync.get(name))[name] as T;

        return {
          state,
        };
      },
      async setItem(name: string, { state }: StorageValue<T>) {
        chrome.storage.sync.set({
          [name]: state,
        });
      },
    },
  };
};

export default customLocalStorage;
