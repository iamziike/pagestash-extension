import useBookmark from "@/sidepanel/store/useBookmark";
import BookmarkSearch from "../ui/bookmarks-search";
import Filters from "../ui/filters";
import CollapsibleBookmark from "../ui/pages/bookmarks/collapsible-bookmark";
import { BOOKMARK_FILTERS } from "@/constants";

export default function Bookmarks() {
  const { bookmark } = useBookmark();

  return (
    <section className="py-6 flex flex-col">
      <header>
        <BookmarkSearch autoFocus />
        <Filters
          className="mt-3"
          title="My Bookmarks"
          filters={BOOKMARK_FILTERS}
        />
      </header>
      <main>
        {bookmark?.children?.map((data) => (
          <CollapsibleBookmark key={data?.id} data={data} />
        ))}
      </main>
    </section>
  );
}
