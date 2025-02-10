export type Bookmark = chrome.bookmarks.BookmarkTreeNode;

export type BookmarkCreateArg = chrome.bookmarks.BookmarkCreateArg;

export interface DraggedItem {
  id: string;
  parentId: string;
}

export interface DateRange {
  to?: Date;
  from?: Date;
}

export interface FilterOption {
  type: "input" | "date-range" | "select";
  label: string;
  name: string;
  secondaryName?: string;
}
