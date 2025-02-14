import useBookmark, { bookmarkHelpers } from "@/sidepanel/store/useBookmark";
import useTypedSearchParams from "@/sidepanel/hooks/useTypedSearchParams";
import BookmarksList from "../../ui/pages/bookmarks/BookmarksList";
import { useCallback, useEffect, useState } from "react";
import { BookmarkNode, BookmarkURLFilter } from "@/models";

const Bookmark = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<BookmarkNode | null>(null);
  const { getBookmark, stateId } = useBookmark();
  const {
    searchParams,
    setSearchParams,
    params: filter,
  } = useTypedSearchParams<BookmarkURLFilter>();

  const fetchBookmarks = useCallback(async () => {
    setIsLoading(true);
    const bookmark = await getBookmark();
    const filteredBookmark = bookmarkHelpers.filterBookmark({
      bookmark,
      filter,
      config: {
        skipEmptyFolder: Boolean(filter?.search),
      },
    });

    setData(filteredBookmark);
    setIsLoading(false);
  }, [getBookmark, filter]);

  useEffect(() => {
    fetchBookmarks();
  }, [fetchBookmarks, stateId]);

  return (
    <BookmarksList
      data={data}
      isLoading={isLoading}
      filters={searchParams}
      onFiltersChange={setSearchParams}
    />
  );
};

export default Bookmark;
