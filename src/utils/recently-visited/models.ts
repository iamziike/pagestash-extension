import { RECENT_VISITED_LINKS_FILTERS } from "./contants";

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
