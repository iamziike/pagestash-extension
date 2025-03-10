import { CredentialStore } from "@/sidepanel/store/useSettings";
import { Bookmark, Home, Key } from "lucide-react";
import {
  BookmarkURLSearchParam,
  FilterOption,
  RecentLinksVisitedURLSearchParam,
} from "@/models";

export const APP_NAME = "PageStash";

export const DOCUMENTATION: { [K in CredentialStore["type"]]: string } = {
  openai: "https://platform.openai.com/api-keys",
  gemini: "https://aistudio.google.com/app/apikey",
};

export const STORE_KEY = {
  SIDEBAR_THEME: "SIDEBAR_THEME_STORAGE_KEY",
} as const;

export const PAGES = {
  HOME: {
    path: "/",
    label: "Home",
    icon: Home,
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
    {
      type: "number",
      label: "Links to Display",
      name: "pageSize",
      placeholder: "100",
    },
  ];
