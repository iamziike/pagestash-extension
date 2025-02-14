import { create } from "zustand";
import { getRandomID } from "@/utils";
import {
  BookmarkNode,
  BookmarkChangesArg,
  BookmarkCreateArg,
  BookmarkURLFilter,
} from "@/models";

interface BookmarksState {
  bookmark: BookmarkNode | null;
  stateId: string;
}

interface BookmarksStateActions {
  addNewBookmark(bookmark: BookmarkCreateArg): void;
  removeBookmark(id: string, type: "link" | "folder"): void;
  moveBookmark(id: string, destination: BookmarkCreateArg): void;
  updateBookmark(id: string, destination: BookmarkChangesArg): void;
  getBookmark(
    id?: string,
    filter?: BookmarkURLFilter
  ): Promise<BookmarkNode | null>;
}

const useBookmark = create<BookmarksState & BookmarksStateActions>()(
  (setter) => {
    const updateBookmarkList = () => {
      chrome.bookmarks.getTree((bookmarks) =>
        setter({ bookmark: bookmarks[0], stateId: getRandomID() })
      );
    };

    updateBookmarkList();

    return {
      bookmark: null,
      stateId: getRandomID(),
      async addNewBookmark(values) {
        await chrome.bookmarks.create(values);
        updateBookmarkList();
      },
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
      async getBookmark(id) {
        if (id) {
          const bookmark = await chrome.bookmarks.get(id);
          return bookmark?.[0];
        }

        const bookmarkRoot = await chrome.bookmarks.getTree();
        return bookmarkRoot?.[0];
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
    bookmark: BookmarkNode | null,
    config = {
      maxLimit: Infinity,
    }
  ) {
    const links: BookmarkNode[] = [];
    const { maxLimit } = config;

    const traverseBookmarks = (node: BookmarkNode) => {
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
  filterBookmark(props: {
    bookmark: BookmarkNode | null;
    filter?: BookmarkURLFilter | null;
    config?: {
      skipEmptyFolder: boolean;
    };
  }) {
    const { bookmark, config, filter } = props;

    const isWithinRange = (date: Date) => {
      const fromDate = filter?.createdStartDate;
      const toDate = filter?.createdEndDate;

      if (!fromDate) {
        return true;
      }

      const formattedFromDate = new Date(fromDate);
      const formattedToDate = toDate ? new Date(toDate) : new Date();

      return date >= formattedFromDate && date <= formattedToDate;
    };

    const traverseChild = (node: BookmarkNode | null) => {
      if (!node) {
        return null;
      }

      node.children = node?.children?.filter((child) => {
        if (child.url && isWithinRange(new Date(child.dateAdded!))) {
          return true;
        }

        return traverseChild(child);
      });

      if (!node.children?.length && config?.skipEmptyFolder) {
        return null;
      }

      return node;
    };

    return traverseChild(bookmark);
  },
};

export default useBookmark;
