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
       Task:
        Rules:
        a) The search term is case-insensitive.
        b) The search term should either be present on the title or URL of the bookmark or it should correlate with it.
          a) "Correlation" should follow this approach:
            a) A description should be generated for each bookmark using the URL, try and figure what exactly this url is about. 
            If it is facebook, it will obviously be a social media site for chatting etc. And if i search for social media you will return a bookmark that matches facebook right.
            b) The second form of correlation is also based on the dateAdded field on each bookmark object. Always use this ${new Date(
              "Jan 01 1990"
            )} as the start and this ${new Date().toISOString()} as the end date. Unless a date is specified. 
            If the searchterm includes a date range eg) last week, last month, yesterday, last year till yesterday, today, on Monday. Change the start date to match the date. if no end date is specified then still keep the default date, change it only if an end date is specified on search term.
            Once a date range is computed only return bookmarks that fall within that date range.

            Nb// Sometimes a date range is not specified but a date is eg) all Mondays, all Thursdays, all Fridays, all Saturdays, all Sundays, all Tuesdays, all Wednesdays, or all bookmarks that were created on 7th. In this case, you should return all bookmarks that were created on that day.
            
        Remember this rules are not exhaustive, you can add more rules to make the search more accurate.
        Just make sure you understand the search term entered and understand the bookmarks you have and return the most accurate bookmarks that match the search term.

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
      const searchTermFilter = filter?.get("query");

      if (hasDateFilter) {
        links = links.filter((node) =>
          isWithinDateRange(new Date(node.dateAdded!), dateRange)
        );
      }

      if (searchTermFilter) {
        const prompt = generateSearchTerm(searchTermFilter, links);
        const { data, error, type } = await promptHelpers.makePrompt<string[]>(
          prompt
        );

        if (type === "error") {
          return {
            nodeType: "links",
            data: null,
            error,
          };
        }

        const lowerCasedSearchFilter = searchTermFilter;

        links = links.filter(
          ({ id, title, url }) =>
            title?.toLowerCase()?.includes(lowerCasedSearchFilter) ||
            url?.includes(lowerCasedSearchFilter) ||
            data?.includes(id)
        );

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
