import CustomSearch from "../../custom-search";
import CollapsibleBookmark from "./collapsible-bookmark";
import Filters from "../../filters";
import EmptyState from "../../empty-state";
import Loading from "../../loading";
import { BookmarkNode } from "@/models";
import { BOOKMARK_FILTERS } from "@/constants";
import { SetURLSearchParams } from "react-router-dom";

interface Props {
  data: BookmarkNode | null;
  isLoading: boolean;
  filters: URLSearchParams;
  onFiltersChange: SetURLSearchParams;
}

const BookmarksList = ({
  data,
  isLoading,
  filters,
  onFiltersChange,
}: Props) => {
  return (
    <section className="py-6 flex flex-col flex-1 h-full">
      <header>
        <CustomSearch
          defaultValue={filters.get("query") ?? ""}
          placeholder="Search for Bookmarks..."
          handleSubmit={({ query = "" }) => {
            filters.set("query", query);
            onFiltersChange(filters);
          }}
        />
        <Filters
          className="mt-3"
          title="My Bookmarks"
          filters={BOOKMARK_FILTERS}
          searchParams={filters}
          onChange={onFiltersChange}
        />
      </header>

      <main className="h-full flex-1 hidden-scrollbar">
        <Loading isLoading={isLoading} />

        <EmptyState
          visible={!data && !isLoading}
          title="No Bookmarks yet"
          description="Start adding your bookmarks here for quick access"
        />

        {data?.parentId ? (
          <CollapsibleBookmark key={data?.id} data={data} isDefaultOpen />
        ) : (
          data?.children?.map((data) => (
            <CollapsibleBookmark key={data?.id} data={data} isDefaultOpen />
          ))
        )}
      </main>
    </section>
  );
};

export default BookmarksList;
