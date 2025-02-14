// GLOBAL ////////////////////////////////
import { RECENT_VISITED_LINKS_FILTERS } from "@/constants";

export interface DraggedItem {
  id: string;
  parentId: string;
}

export interface DateRange {
  to?: Date;
  from?: Date;
}

export type FolderLink = "folder" | "link";

export interface FilterOption {
  type: "input" | "date-range" | "select";
  label: string;
  name: string;
  secondaryName?: string;
}

// BOOKMARK ////////////////////////////////
export type BookmarkNode = chrome.bookmarks.BookmarkTreeNode;

export type BookmarkCreateArg = chrome.bookmarks.BookmarkCreateArg;

export type BookmarkChangesArg = chrome.bookmarks.BookmarkChangesArg;

export type BookmarkFormState =
  | {
      action: "update";
      variant: FolderLink;
      bookmark: BookmarkNode;
    }
  | {
      action: "create";
      parentId: string;
    };

export type BookmarkURLFilter = Partial<{
  id: string;
  createdStartDate: string;
  createdEndDate: string;
  search: string;
}>;

// RECENTLY_VISIITED_LINKS ////////////////////////////////

export type RecentlyVisitedFilterType = {
  maxResults?: number;
  query?: string;
  range?: Partial<{
    to: Date;
    from: Date;
  }>;
};

export type RecentlyVisitedLink = chrome.history.HistoryItem;

export type RecentlyVisitedLinkPageSearchParams = {
  [key in
    | (typeof RECENT_VISITED_LINKS_FILTERS)[number]["name"]
    | (typeof RECENT_VISITED_LINKS_FILTERS)[number]["secondaryName"]
    | "query"]: string;
};

// FAVOURITES ////////////////////////////////

export type FavouriteBookmark = {
  id: string;
  addedAt: string;
  type: FolderLink;
};
