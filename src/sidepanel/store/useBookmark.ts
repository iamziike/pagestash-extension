import { create } from "zustand";
import { Bookmark, BookmarkChangesArg, BookmarkCreateArg } from "@/models";

interface BookmarksState {
  bookmark: Bookmark | null;
}

interface BookmarksStateActions {
  addNewBookmark(bookmark: BookmarkCreateArg): void;
  removeBookmark(id: string, type: "link" | "folder"): void;
  moveBookmark(id: string, destination: BookmarkCreateArg): void;
  updateBookmark(id: string, destination: BookmarkChangesArg): void;
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
      async removeBookmark(id: string, type = "link") {
        if (type === "link") {
          await chrome.bookmarks.remove(id);
        } else {
          await chrome.bookmarks.removeTree(id);
        }

        updateBookmarkList();
      },
      async moveBookmark(id, destination) {
        await chrome.bookmarks.move(id, destination);
        updateBookmarkList();
      },
      async updateBookmark(id, destination) {
        await chrome.bookmarks.update(id, destination);
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
  getAllBookmarkLinks(
    bookmark: Bookmark | null,
    config = {
      maxLimit: Infinity,
    }
  ): Bookmark[] {
    const links: Bookmark[] = [];
    const { maxLimit } = config;

    const traverseBookmarks = (node: Bookmark) => {
      if (links.length >= maxLimit) {
        return true;
      }

      if (node.url) {
        links.push(node);
      }

      if (node.children) {
        // prevent unneceesary looping
        // stops when maxLimit hit
        node.children.some(traverseBookmarks);
      }
    };

    if (bookmark) {
      traverseBookmarks(bookmark);
    }

    return links;
  },
};

export default useBookmark;
