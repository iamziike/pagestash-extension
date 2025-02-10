import { RecentlyVisitedFilterType } from "@/utils/recently-visited/models";
import { useCallback } from "react";

const useRecentlyVisited = () => {
  const getRecentlyVisited = useCallback(
    ({ maxResults, range, query }: RecentlyVisitedFilterType) => {
      return chrome.history.search({
        text: query ?? "",
        maxResults,
        startTime: range?.from?.getTime(),
        endTime: range?.to?.getTime() || Date.now(),
      });
    },
    []
  );

  const removeRecentlyVisited = useCallback(({ url }: { url?: string }) => {
    return chrome.history.deleteUrl({ url: url ?? "" });
  }, []);

  return { getRecentlyVisited, removeRecentlyVisited };
};

export default useRecentlyVisited;
