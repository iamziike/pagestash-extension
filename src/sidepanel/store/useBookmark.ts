import promptHelpers from "@/utils/promptHelpers";
import { create } from "zustand";
import { getRandomID, isObjectValuesTruthy, isWithinDateRange } from "@/utils";
import {
  BookmarkNode,
  BookmarkChangesArg,
  BookmarkCreateArg,
  BookmarkURLSearchParam,
  TypedURLSearchParam,
  PromptError,
  FolderLink,
} from "@/models";
import trim from "lodash/trim";

interface BookmarksState {
  bookmark: BookmarkNode | null;
  stateId: string;
}

interface BookmarksStateActions {
  addNewBookmark(bookmark: BookmarkCreateArg): void;
  removeBookmark(id: string, type: "link" | "folder"): void;
  moveBookmark(id: string, destination: BookmarkCreateArg): void;
  updateBookmark(id: string, destination: BookmarkChangesArg): void;
  getBookmark(id?: string, type?: FolderLink): Promise<BookmarkNode | null>;
  getBookmarks(data: {
    id?: string;
    filter?: TypedURLSearchParam<BookmarkURLSearchParam>;
  }): Promise<
    | {
        data: BookmarkNode[] | null;
        nodeType: "links";
        error?: PromptError | null;
      }
    | { data: BookmarkNode | null; nodeType: "all"; error?: PromptError | null }
  >;
}

const useBookmark = create<BookmarksState & BookmarksStateActions>()(
  (setter) => {
    const generateSearchTerm = (
      searchTerm: string,
      bookmark: BookmarkNode[]
    ) => {
      return `
      Task: Rules:

      Global Rule: Divide the search term into three categories:

      (1) What the user is looking for
      (2) What the user is NOT looking for
      (3) The date range the user is targeting.
      (4) Find "every" bookmark that matches the search term. (do not return only the first match or incomplete matches)
      Search Logic:

      The search is case-insensitive.
      The search term must either match the title or URL of a bookmark, or it must be correlated with it.
      Correlation Logic:
      Generate a description for each bookmark based on its URL to understand its purpose.
      For example, if the URL is from Facebook, classify it as a social media site. A search term like 'social media' should return Facebook-related bookmarks.
      The second correlation is based on the dateAdded field.
      Default start date: 'Jan 01, 1990'.
      Default end date: the current date (${new Date().toISOString()}).
      If the search term specifies a date range (e.g., 'last week', 'yesterday', 'on Monday'), adjust the start date accordingly.
      If a specific day or date is mentioned (e.g., 'all Mondays', 'all 7ths'), return bookmarks created on that specific day.
      Output Format:

      Return only a JSON object in the following format:
      {"ids": ["bookmark1", "bookmark2"], "dateRange": {"from": "YYYY-MM-DDTHH:MM:SSZ", "to": "YYYY-MM-DDTHH:MM:SSZ", "todayDate": "YYYY-MM-DDTHH:MM:SSZ"}}.
      No additional text, explanations, or formatting should be included in the response.

      Additional Rules:

      The endDate should always be set to 23:59:59.
      Always calculate today's date and use it to compare against the user's requested date range.

 
      Here is the search-term = ${searchTerm}.
      Here is the array of objects =  ${JSON.stringify(
        bookmark?.map(({ id, title, children, url, dateAdded }) => ({
          id,
          title,
          children,
          url,
          dateAdded: new Date(dateAdded!)?.toISOString(),
        })),
        null,
        2
      )}
        `;
    };
    const getBookmark: BookmarksStateActions["getBookmark"] = async (
      id,
      type = "folder"
    ) => {
      if (id) {
        const bookmark = await (type === "folder"
          ? chrome.bookmarks.getSubTree(id)
          : chrome.bookmarks.get(id));
        return bookmark?.[0];
      }

      return (await chrome.bookmarks.getTree())?.[0];
    };

    const getBookmarks: BookmarksStateActions["getBookmarks"] = async ({
      id,
      filter,
    }) => {
      const node = await getBookmark(id);
      const hasFilter = isObjectValuesTruthy(
        Array.from(filter?.values() || [])
      );

      if (!hasFilter) {
        return { data: node, nodeType: "all" };
      }

      const dateRange = {
        from: filter?.get("createdStartDate"),
        end: filter?.get("createdEndDate"),
      };

      let links = bookmarkHelpers.getAllBookmarkLinks(node);
      const hasDateFilter = isObjectValuesTruthy(Object.values(dateRange));
      const searchTermFilter = trim(filter?.get("query") ?? "");

      if (hasDateFilter) {
        links = links.filter((node) =>
          isWithinDateRange(new Date(node.dateAdded!), dateRange)
        );
      }

      if (searchTermFilter) {
        const prompt = generateSearchTerm(searchTermFilter, links);
        const { data, error, type } = await promptHelpers.makePrompt<{
          ids: string[];
          dateRange: { from: string; to: string; todayDate: string };
        }>(prompt);

        if (type === "error") {
          return {
            nodeType: "links",
            data: null,
            error,
          };
        }

        links = links.filter(({ id, title, url, dateAdded }) => {
          const lowerCasedSearchFilter = searchTermFilter?.toLowerCase();

          if (!isWithinDateRange(new Date(dateAdded!), data?.dateRange)) {
            return false;
          }

          return (
            title?.toLowerCase()?.includes(lowerCasedSearchFilter) ||
            url?.includes(lowerCasedSearchFilter) ||
            data?.ids?.includes(id)
          );
        });

        return {
          data: links,
          nodeType: "links",
        };
      }

      return { data: links, nodeType: "links" };
    };

    const addNewBookmark: BookmarksStateActions["addNewBookmark"] = async (
      values
    ) => {
      await chrome.bookmarks.create(values);
      updateBookmarkList();
    };

    const removeBookmark: BookmarksStateActions["removeBookmark"] = async (
      id: string,
      type = "link"
    ) => {
      if (type === "link") {
        await chrome.bookmarks.remove(id);
      } else {
        await chrome.bookmarks.removeTree(id);
      }

      updateBookmarkList();
    };

    const moveBookmark: BookmarksStateActions["moveBookmark"] = async (
      id,
      destination
    ) => {
      await chrome.bookmarks.move(id, destination);
      updateBookmarkList();
    };

    const updateBookmark: BookmarksStateActions["updateBookmark"] = async (
      id,
      destination
    ) => {
      await chrome.bookmarks.update(id, destination);
      updateBookmarkList();
    };

    const updateBookmarkList = () => {
      chrome.bookmarks.getTree((bookmarks) =>
        setter({ bookmark: bookmarks[0], stateId: getRandomID() })
      );
    };

    updateBookmarkList();

    return {
      stateId: getRandomID(),
      bookmark: null,
      getBookmark,
      updateBookmark,
      addNewBookmark,
      removeBookmark,
      moveBookmark,
      getBookmarks,
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
  async getRootBookmark() {
    return (await chrome.bookmarks.getTree())?.[0];
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
};

export default useBookmark;
