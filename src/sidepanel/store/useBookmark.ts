import promptHelpers from "@/utils/promptHelpers";
import { create } from "zustand";
import { getRandomID, isObjectValuesTruthy, isWithinDateRange } from "@/utils";
import {
  BookmarkNode,
  BookmarkChangesArg,
  BookmarkCreateArg,
  BookmarkURLSearchParam,
  TypedURLSearchParam,
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
  getBookmark(id?: string): Promise<BookmarkNode | null>;
  getBookmarks(data: {
    id?: string;
    filter?: TypedURLSearchParam<BookmarkURLSearchParam>;
  }): Promise<
    | { data: BookmarkNode[]; type: "links" }
    | { data: BookmarkNode | null; type: "node" }
  >;
}

const useBookmark = create<BookmarksState & BookmarksStateActions>()(
  (setter) => {
    const generateSearchTerm = (
      searchTerm: string,
      bookmark: BookmarkNode[]
    ) => {
      return `
       Task:
        I have an array of bookmarks, each containing an id, url, title, and dateAdded field. I also have a search term entered by a user, which is a natural language query. Your goal is to intelligently match relevant bookmarks based on this search term.

        Steps to Perform the Search:
        Handle Date Filtering:

        First, check if the search term contains a date or a date range.
        If a date or date range is present, filter the bookmarks using the dateAdded field to remove any bookmarks that fall outside the specified time frame.
        Generate a Website Description:

        For each bookmark, attempt to generate a brief description of what the website is about based on its title and url.
        If a reliable description cannot be generated, use the title as the description.
        Match Search Term with Bookmark Descriptions:

        Remove any date-related keywords from the user's search term to get the core intent of the query.
        Compare the search term (without the date) against each generated description to find relevant matches.
        A bookmark should be considered a match if the search term is similar to the description, even if the exact words are not present.
        Expected Matching Behavior:
        If a bookmark describes a social media platform, and the user searches for "social media sites", that bookmark should be included in the results.
        If the search includes a date range (e.g., "GitHub sites added in 2024"), only bookmarks added within 2024 should be considered.
        Output:
        Return a JSON array containing only the id values of the bookmarks that match the search criteria.
        The response should contain only JSON with no extra text, explanations, or formatting.

        Here is the search-term = ${searchTerm}
        Here is the array of objects =  ${JSON.stringify(
          bookmark?.map(({ id, title, children, dateAdded }) => ({
            id,
            title,
            children,
            dateAdded: new Date(dateAdded!)?.toISOString(),
          }))
        )}
        `;
    };
    const getBookmark: BookmarksStateActions["getBookmark"] = async (id) => {
      if (id) {
        const bookmark = await chrome.bookmarks.get(id);
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
        return { data: node, type: "node" };
      }

      const dateRange = {
        from: filter?.get("createdStartDate"),
        end: filter?.get("createdEndDate"),
      };
      let links = bookmarkHelpers.getAllBookmarkLinks(node);
      const hasDateFilter = isObjectValuesTruthy(Object.values(dateRange));
      const searchTermFilter = filter?.get("query");

      if (hasDateFilter) {
        links = links.filter((node) =>
          isWithinDateRange(new Date(node.dateAdded!), dateRange)
        );
      }

      if (searchTermFilter) {
        const prompt = generateSearchTerm(searchTermFilter, links);
        const response =
          (await promptHelpers.makePrompt<string[]>(prompt, {
            responseType: "array",
          })) || [];

        links = [];
        for (const link of response) {
          const node = await getBookmark(link);
          links.push(node!);
        }
      }

      return { data: links, type: "links" };
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
