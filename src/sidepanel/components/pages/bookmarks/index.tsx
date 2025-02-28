import useBookmark from "@/sidepanel/store/useBookmark";
import useTypedSearchParams from "@/sidepanel/hooks/useTypedSearchParams";
import BookmarksList from "../../ui/pages/bookmarks/BookmarksList";
import { useCallback, useEffect, useState } from "react";
import { BookmarkNode, BookmarkURLSearchParam, PromptError } from "@/models";

const Bookmark = () => {
  const [error, setError] = useState<PromptError | null | undefined>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<BookmarkNode | BookmarkNode[] | null>(null);
  const { stateId, getBookmarks } = useBookmark();
  const { searchParams, setSearchParams } =
    useTypedSearchParams<BookmarkURLSearchParam>();

  const fetchBookmarks = useCallback(async () => {
    setIsLoading(true);
    const bookmark = await getBookmarks({ filter: searchParams });

    setIsLoading(false);
    setData(bookmark?.data);
    setError(bookmark?.error);
  }, [getBookmarks, searchParams]);

  useEffect(() => {
    fetchBookmarks();
  }, [fetchBookmarks, stateId]);

  return (
    <BookmarksList
      data={data}
      isLoading={isLoading}
      filters={searchParams}
      onFiltersChange={setSearchParams}
      error={{
        data: error,
        onClear() {
          setError(null);
        },
      }}
    />
  );
};

export default Bookmark;
