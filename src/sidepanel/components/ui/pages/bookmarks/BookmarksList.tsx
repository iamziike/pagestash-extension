import CustomSearch from "../../custom-search";
import CollapsibleBookmark from "./collapsible-bookmark";
import Filters from "../../filters";
import EmptyState from "../../empty-state";
import Loading from "../../loading";
import { BOOKMARK_FILTERS } from "@/constants";
import { SetURLSearchParams } from "react-router-dom";
import {
  BookmarkNode,
  BookmarkURLSearchParam,
  TypedURLSearchParam,
} from "@/models";

interface Props {
  data: BookmarkNode | BookmarkNode[] | null;
  isLoading: boolean;
  filters: TypedURLSearchParam<BookmarkURLSearchParam>;
  onFiltersChange: SetURLSearchParams;
}

const BookmarksList = ({
  data,
  isLoading,
  filters,
  onFiltersChange,
}: Props) => {
  const renderView = () => {
    if ((!data || (data instanceof Array && !data?.length)) && !isLoading) {
      const dateFilters = filters.get("createdStartDate");
      const searchTerm = filters.get("query");

      const hasFilters = dateFilters || searchTerm;
      return (
        <EmptyState
          title={hasFilters ? "No Results" : "No Bookmarks yet"}
          description={
            hasFilters ? (
              <>
                No results found for {searchTerm || "filter"}. Try adjusting
                your it.
              </>
            ) : (
              "Start adding your bookmarks here for quick access"
            )
          }
        />
      );
    }

    if (data instanceof Array) {
      return (
        <CollapsibleBookmark
          isRoot
          isDefaultOpen
          data={{
            id: "0",
            title: "Results",
            children: data,
          }}
        />
      );
    }

    if (data?.parentId) {
      return <CollapsibleBookmark data={data} isDefaultOpen />;
    }

    if (data) {
      return data?.children?.map?.((child) => (
        <CollapsibleBookmark key={child?.id} data={child} isDefaultOpen />
      ));
    }
  };

  const handleSearch = (query: string) => {
    filters.set("query", query);
    onFiltersChange(filters);
  };

  return (
    <section className="py-6 flex flex-col flex-1 h-full">
      <header>
        <CustomSearch
          defaultValue={filters.get("query") ?? ""}
          placeholder="Search for Bookmarks..."
          onBlur={({ target }) => {
            handleSearch(target.value);
          }}
          onChange={({ query = "" }) => {
            handleSearch(query);
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

        {renderView()}
      </main>
    </section>
  );
};

export default BookmarksList;
