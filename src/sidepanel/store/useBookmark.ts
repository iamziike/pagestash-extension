import { create } from "zustand";
import { Bookmark, BookmarkCreateArg } from "@/models";

interface BookmarksState {
  bookmark: Bookmark | null;
}

interface BookmarksStateActions {
  addNewBookmark(bookmark: BookmarkCreateArg): void;
  removeBookmark(id: string): void;
  moveBookmark(id: string, destination: BookmarkCreateArg): void;
}

const useBookmark = create<BookmarksState & BookmarksStateActions>()(
  (setter) => {
    const updateBookmarkList = () => {
      chrome.bookmarks.getTree((bookmarks) =>
        setter({ bookmark: bookmarks[0] })
      );
    };

    updateBookmarkList();

    return {
      bookmark: null,
      addNewBookmark() {},
      removeBookmark() {},
      async moveBookmark(id, destination) {
        await chrome.bookmarks.move(id, destination);
        updateBookmarkList();
      },
    };
  }
);

export const bookmarkHelpers = {
  getBookmarkFaviconURL(searchURL: string) {
    const url = new URL(chrome.runtime.getURL("/_favicon/"));
    url.searchParams.set("pageUrl", searchURL);
    url.searchParams.set("size", "64");
    return url.toString();
  },
};

export default useBookmark;
