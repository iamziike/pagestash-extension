import useTypedSearchParams from "@/sidepanel/hooks/useTypedSearchParams";
import useBookmark from "@/sidepanel/store/useBookmark";
import BookmarksList from "../../ui/pages/bookmarks/BookmarksList";
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BookmarkNode, BookmarkURLSearchParam, PromptError } from "@/models";
import { PAGES } from "@/constants";

const BookmarkSubFolder = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<PromptError | null | undefined>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<BookmarkNode | BookmarkNode[] | null>(null);
  const { getBookmarks, stateId } = useBookmark();
  const { id } = useParams();
  const { searchParams, setSearchParams } =
    useTypedSearchParams<BookmarkURLSearchParam>();

  const fetchBookmarks = useCallback(async () => {
    setIsLoading(true);
    const bookmark = await getBookmarks({ id, filter: searchParams });

    setIsLoading(false);
    setError(bookmark?.error);
    setData(bookmark?.data);

    if (!bookmark?.data) {
      navigate(PAGES.BOOKMARKS.path);
    }
  }, [getBookmarks, id, navigate, searchParams]);

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

export default BookmarkSubFolder;
