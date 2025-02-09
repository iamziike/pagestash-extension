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
} as const;

export const BOOKMARK_FILTERS = [
  { type: "date-range", label: "Visited From", name: "visitDate" },
  { type: "date-range", label: "Created From", name: "createdDate" },
] as const;

export const DRAGGABLE_ITEMS = {
  FOLDER: "FOLDER",
  LINK: "LINK",
} as const;
