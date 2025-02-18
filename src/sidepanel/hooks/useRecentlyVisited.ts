import { RecentlyVisitedFilterType } from "@/models";
import { useCallback, useState } from "react";

const useRecentlyVisited = () => {
  const [isFetchingRecentlyVisited, setIsFetchingRecentlyVisited] =
    useState(false);

  const getRecentlyVisited = useCallback(
    async ({ maxResults, range, query }: RecentlyVisitedFilterType) => {
      setIsFetchingRecentlyVisited(true);
      const response = await chrome.history.search({
        text: query ?? "",
        maxResults,
        startTime: range?.from?.getTime(),
        endTime: range?.to?.getTime() || Date.now(),
      });
      setIsFetchingRecentlyVisited(false);
      return response;
    },
    []
  );

  const removeRecentlyVisited = useCallback(({ url }: { url?: string }) => {
    return chrome.history.deleteUrl({ url: url ?? "" });
  }, []);

  return {
    getRecentlyVisited,
    removeRecentlyVisited,
    isFetchingRecentlyVisited,
  };
};

export default useRecentlyVisited;
