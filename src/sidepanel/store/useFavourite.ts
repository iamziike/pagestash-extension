import { FavouriteBookmark } from "@/models";
import { create } from "zustand";
import { persist, type StorageValue } from "zustand/middleware";

interface FavouriteItem {
  [key: string]: Omit<FavouriteBookmark, "type" | "id">;
}

interface FavouriteState {
  data: {
    folder: FavouriteItem;
    link: FavouriteItem;
  };
}

interface FavouriteStateActions {
  add(data: Omit<FavouriteBookmark, "addedAt">): void;
  delete(id: string, type: FavouriteBookmark["type"]): void;
  has(id: string, type: FavouriteBookmark["type"]): boolean;
}

const FAVOURITES_STORE_NAME = "FAVOURITES_STORE_NAME____";

const useFavourite = create<FavouriteState & FavouriteStateActions>()(
  persist(
    (setter, getter) => ({
      data: {
        folder: {},
        link: {},
      },
      add(data) {
        setter((prevState) => {
          prevState.data[data.type][data.id] = {
            addedAt: new Date().toISOString(),
          };

          return { ...prevState };
        });
      },
      delete(id, type) {
        setter((prevState) => {
          delete prevState.data[type][id];

          return { ...prevState };
        });
      },
      has(id, type) {
        const { data } = getter();
        return Boolean(data[type][id]);
      },
    }),
    {
      name: FAVOURITES_STORE_NAME,
      storage: {
        removeItem(name) {
          chrome.storage.sync.remove(name);
        },
        async getItem(name) {
          const state = (await chrome.storage.sync.get(name))[
            name
          ] as FavouriteState;

          return {
            state,
          };
        },
        setItem(name, { state }: StorageValue<FavouriteState>) {
          const data: FavouriteState = {
            data: state.data,
          };

          chrome.storage.sync.set({
            [name]: data,
          });
        },
      },
    }
  )
);

export default useFavourite;
