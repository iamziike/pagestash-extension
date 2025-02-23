import customLocalStorage from "@/utils/customLocalStorage";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { toDate } from "@/utils";
import {
  RecentLinksVisitedURLSearchParam,
  TypedURLSearchParam,
} from "@/models";

interface RecentlyVisitedState {
  data: {
    isDisclaimerDisplayed: boolean;
  };
}

interface RecentlyVisitedStateActions {
  getRecentlyVisited(
    searchParams: TypedURLSearchParam<RecentLinksVisitedURLSearchParam>
  ): Promise<chrome.history.HistoryItem[]>;
  removeRecentlyVisited(url: string): void;
  viewedDisclaimer(): void;
}

const RECENTLY_VISITED_LINKS_KEY_NAME = "RECENTLY_VISITED_LINKS_KEY_NAME";

const useFavourite = create<
  RecentlyVisitedState & RecentlyVisitedStateActions
>()(
  persist(
    (setter) => ({
      data: {
        isDisclaimerDisplayed: false,
      },
      // async getRecentlyVisited({ maxResults, range, query }) {
      async getRecentlyVisited(searchParams) {
        const maxResults = Number(searchParams?.get("pageSize") || 100);
        const query = searchParams?.get("query") ?? "";
        const response = await chrome.history.search({
          text: query,
          maxResults,
          startTime: toDate(searchParams?.get("visitStartDate"))?.getTime(),
          endTime: toDate(searchParams?.get("visitEndDate"))?.getTime(),
        });
        return response;
      },
      removeRecentlyVisited(url) {
        return chrome.history.deleteUrl({ url });
      },

      viewedDisclaimer() {
        setter({
          data: {
            isDisclaimerDisplayed: true,
          },
        });
      },
    }),
    customLocalStorage<RecentlyVisitedState>({
      storeKey: RECENTLY_VISITED_LINKS_KEY_NAME,
    })
  )
);

export default useFavourite;
