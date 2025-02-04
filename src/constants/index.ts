import { Bookmark, Home, Key, Settings } from "lucide-react";

export const APP_NAME = "PageStash";

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
