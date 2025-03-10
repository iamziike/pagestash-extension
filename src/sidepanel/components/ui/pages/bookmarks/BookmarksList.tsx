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
  PromptError,
  TypedURLSearchParam,
} from "@/models";
import CustomAlert from "../../custom-alert";

interface Props {
  data: BookmarkNode | BookmarkNode[] | null;
  isLoading: boolean;
  error?: {
    data?: PromptError | null;
    onClear: VoidFunction;
  };
  filters: TypedURLSearchParam<BookmarkURLSearchParam>;
  onFiltersChange: SetURLSearchParams;
}

const BookmarksList = ({
  data,
  isLoading,
  filters,
  onFiltersChange,
  error,
}: Props) => {
  const renderView = () => {
    const searchTerm = filters.get("query");
    const hasFilters = Array.from(filters.values()).length;

    if (data instanceof Array && data?.length) {
      return (
        <CollapsibleBookmark
          isDefaultOpen
          data={{
            id: "0",
            title: "Results",
            children: data,
          }}
        />
      );
    }

    if (data && "id" in data) {
      return <CollapsibleBookmark data={data} isDefaultOpen />;
    }

    if (!isLoading) {
      return (
        <EmptyState
          title={hasFilters ? "No Results" : "No Bookmarks yet"}
          description={
            hasFilters ? (
              <>
                No results found for{" "}
                {searchTerm ? <>"{searchTerm}"</> : "filter applied"}. Try
                adjusting your {searchTerm ? "search query" : "filter"}.
              </>
            ) : (
              "Start adding your bookmarks here for quick access"
            )
          }
        />
      );
    }

    if (!isLoading)
      return (
        <EmptyState
          title={hasFilters ? "No Results" : "No Bookmarks yet"}
          description={
            hasFilters ? (
              <>
                No results found for {searchTerm || "filter"}. Try adjusting
                your search query.
              </>
            ) : (
              "Start adding your bookmarks here for quick access"
            )
          }
        />
      );
  };

  const handleSearch = (query: string) => {
    filters.set("query", query);
    onFiltersChange(filters);
  };

  return (
    <section className="py-6 flex flex-col flex-1 h-full">
      <CustomAlert
        isOpen={Boolean(error?.data)}
        onClose={() => error?.onClear()}
        data={{
          type: "error",
          title: error?.data?.title ?? "",
          description: error?.data?.description,
        }}
      />
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
