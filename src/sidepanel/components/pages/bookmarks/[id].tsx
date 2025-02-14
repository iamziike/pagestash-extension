import useTypedSearchParams from "@/sidepanel/hooks/useTypedSearchParams";
import useBookmark, { bookmarkHelpers } from "@/sidepanel/store/useBookmark";
import BookmarksList from "../../ui/pages/bookmarks/BookmarksList";
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BookmarkNode } from "@/models";
import { PAGES } from "@/constants";

const BookmarkSubFolder = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<BookmarkNode | null>(null);
  const { getBookmark, stateId } = useBookmark();
  const { id } = useParams();
  const {
    searchParams,
    setSearchParams,
    params: filter,
  } = useTypedSearchParams();

  const fetchBookmarks = useCallback(async () => {
    setIsLoading(true);
    const bookmark = await getBookmark(id);
    const filteredBookmark = bookmarkHelpers.filterBookmark({
      bookmark,
      filter,
    });

    if (filteredBookmark) {
      setData(filteredBookmark);
      setIsLoading(false);
      return;
    }
    navigate(PAGES.BOOKMARKS.path);
  }, [getBookmark, id, navigate, filter]);

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

export default BookmarkSubFolder;
