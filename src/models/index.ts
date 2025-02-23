// GLOBAL ////////////////////////////////
export type CustomObject<T extends string = string> = {
  [key in T]: string;
};

export interface TypedURLSearchParam<T extends Record<string, string>>
  extends URLSearchParams {
  get<K extends keyof T>(key: K): string | null;
  set<K extends keyof T>(key: K, value: T[K]): void;
}

export interface DraggedItem {
  id: string;
  parentId: string;
}

export interface DateRange {
  to?: Date;
  from?: Date;
}

export type FolderLink = "folder" | "link";

export interface FilterOption<
  T extends CustomObject<string> = CustomObject<string>
> {
  type: "input" | "date-range" | "select" | "number";
  label: string;
  name: keyof T;
  secondaryName?: keyof T;
  placeholder?: string;
}

export type URLDefaultSearchParam = Partial<{
  id: string;
  query: string;
}>;

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

export type BookmarkURLSearchParam = URLDefaultSearchParam & {
  createdStartDate: string;
  createdEndDate: string;
};

// RECENTLY_VISIITED_LINKS ////////////////////////////////

export type RecentlyVisitedFilterType = {
  maxResults?: number;
  query?: string | null;
  range?: Partial<{
    to: Date;
    from: Date;
  }>;
};

export type RecentLinksVisitedURLSearchParam = URLDefaultSearchParam & {
  visitStartDate: string;
  visitEndDate: string;
  pageSize: string;
};

export type RecentlyVisitedLink = chrome.history.HistoryItem;

// FAVOURITES ////////////////////////////////

export type FavouriteBookmark = {
  id: string;
  addedAt: string;
  type: FolderLink;
};

// PROMPT KEY
export type PromptStore = {
  provider: "google" | "openai";
  apiKey: string;
};

export type GoogleErrorDetails = {
  error?: {
    status: "RESOURCE_EXHAUSTED";
  };
  errorDetails?: {
    reason: "API_KEY_INVALID";
  }[];
};
