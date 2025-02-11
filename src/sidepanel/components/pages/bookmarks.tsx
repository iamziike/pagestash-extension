import useBookmark from "@/sidepanel/store/useBookmark";
import BookmarkSearch from "../ui/bookmarks-search";
import Filters from "../ui/filters";
import CollapsibleBookmark from "../ui/pages/bookmarks/collapsible-bookmark";
import useTypedSearchParams from "@/sidepanel/hooks/useTypedSearchParams";
import { BOOKMARK_FILTERS } from "@/constants";

export default function Bookmarks() {
  const { searchParams } = useTypedSearchParams();
  const { bookmark } = useBookmark();

  return (
    <section className="py-6 flex flex-col flex-1 h-full">
      <header>
        <BookmarkSearch autoFocus />
        <Filters
          className="mt-3"
          title="My Bookmarks"
          filters={BOOKMARK_FILTERS}
          searchParams={searchParams}
          onChange={() => {}}
        />
      </header>
      <main className="h-full flex-1 hidden-scrollbar">
        {bookmark?.children?.map((data) => (
          <CollapsibleBookmark key={data?.id} data={data} />
        ))}
      </main>
    </section>
  );
}
