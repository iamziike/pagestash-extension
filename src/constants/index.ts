import {
  BookmarkURLSearchParam,
  FilterOption,
  RecentLinksVisitedURLSearchParam,
} from "@/models";
import { Bookmark, Home, Key, Settings } from "lucide-react";

export const APP_NAME = "PageStash";

export const OPENAI_CREATE_KEY_DOCS_URL =
  "https://platform.openai.com/api-keys";

export const STORE_KEY = {
  SIDEBAR_THEME: "SIDEBAR_THEME_STORAGE_KEY",
} as const;

export const PAGES = {
  HOME: {
    path: "/",
    label: "Home",
    icon: Home,
  },
  SETTINGS: {
    path: "/settings",
    label: "Settings",
    icon: Settings,
  },
  BOOKMARKS: {
    path: "/bookmarks",
    label: "Bookmarks",
    icon: Bookmark,
  },
  CREDENTIALS: {
    path: "/credentials",
    label: "Credentials",
    icon: Key,
  },
  RECENTLY_VISITED: {
    path: "/recently-visited",
    label: "Recently Visited",
    icon: Key,
  },
} as const;

export const BOOKMARK_FILTERS: FilterOption<BookmarkURLSearchParam>[] = [
  {
    type: "date-range",
    label: "Created From",
    name: "createdStartDate",
    secondaryName: "createdEndDate",
  },
];

export const DRAGGABLE_ITEMS = {
  FOLDER: "FOLDER",
  LINK: "LINK",
} as const;

export const RECENT_VISITED_LINKS_FILTERS: FilterOption<RecentLinksVisitedURLSearchParam>[] =
  [
    {
      type: "date-range",
      label: "Visited From",
      name: "visitStartDate",
      secondaryName: "visitEndDate",
    },
  ];
