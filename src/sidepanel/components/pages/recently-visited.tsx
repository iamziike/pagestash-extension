import Filters from "../ui/filters";
import CustomMenu from "../ui/custom-menu";
import EmptyState from "../ui/empty-state";
import useRecentlyVisited from "@/sidepanel/hooks/useRecentlyVisited";
import useTypedSearchParams from "@/sidepanel/hooks/useTypedSearchParams";
import Loading from "../ui/loading";
import CustomAlert from "../ui/custom-alert";
import CustomSearch from "../ui/custom-search";
import { bookmarkHelpers } from "@/sidepanel/store/useBookmark";
import { titleCase } from "title-case";
import { EllipsisVertical } from "lucide-react";
import { Separator } from "@radix-ui/react-separator";
import { copyToClipboard, navigateWindowTo } from "@/utils";
import { useCallback, useEffect, useState } from "react";
import { RECENT_VISITED_LINKS_FILTERS } from "@/constants";
import {
  RecentLinksVisitedURLSearchParam,
  RecentlyVisitedLink,
} from "@/models";

const RecentlyVisitedLinks = () => {
  const [isLoading, setisLoading] = useState(true);
  const [recentlyVisitedLinks, setRecentlyVisitedLinks] =
    useState<RecentlyVisitedLink[]>();
  const { getRecentlyVisited, removeRecentlyVisited, data, viewedDisclaimer } =
    useRecentlyVisited();
  const { searchParams, setSearchParams } =
    useTypedSearchParams<RecentLinksVisitedURLSearchParam>();
  const searchTerm = searchParams?.get("query");

  const fetchRecentlyVisitedLinks = useCallback(async () => {
    setisLoading(true);
    const response = await getRecentlyVisited(searchParams);
    setRecentlyVisitedLinks(response);
    setisLoading(false);
  }, [getRecentlyVisited, searchParams]);

  const handleSearch = (query: string) => {
    searchParams.set("query", query);
    setSearchParams(searchParams);
  };

  useEffect(() => {
    fetchRecentlyVisitedLinks();
  }, [fetchRecentlyVisitedLinks]);

  return (
    <section className="py-6 flex flex-col flex-1 h-full">
      <CustomAlert
        isOpen={!data.isDisclaimerDisplayed}
        onClose={viewedDisclaimer}
        data={{
          type: "warning",
          title: "Disclaimer",
          description: (
            <>
              Searching with full sentences isn't supported on this page yet
              <br />
              Please use the link name to find what you need.
            </>
          ),
        }}
      />

      <div>
        <CustomSearch
          placeholder="Search for Recently Visited..."
          onBlur={({ target }) => handleSearch(target.value)}
          onChange={({ query = "" }) => handleSearch(query)}
        />

        <Filters
          className="mt-3"
          title="My Recents"
          filters={RECENT_VISITED_LINKS_FILTERS}
          searchParams={searchParams}
          onChange={setSearchParams}
        />
      </div>
      <main className="h-full flex-1 hidden-scrollbar">
        <Loading isLoading={isLoading} />

        <EmptyState
          visible={!isLoading && recentlyVisitedLinks?.length === 0}
          title={searchTerm ? "No Results" : "No Recent links yet"}
          description={
            searchTerm
              ? `No results found for "${searchTerm}". Try adjusting your search query.`
              : "Start visiting sites to have them appear here"
          }
        />
        {recentlyVisitedLinks?.map(({ id, title, url }) => (
          <div className="hover:opacity-60 cursor-pointer">
            <div
              key={id}
              className="flex gap-4 items-start py-1"
              onClick={() => {
                copyToClipboard(url);
                navigateWindowTo(url ?? "");
              }}
            >
              <img
                src={bookmarkHelpers.getBookmarkFaviconURL(url ?? "")}
                alt="bookmark favicon"
                loading="lazy"
                width={24}
              />
              <div className="w-full text-ellipsis overflow-hidden text-sm">
                <div className="ellipsis-text">
                  {titleCase(title || "Unamed")}
                </div>
                <div className="text-[11px] opacity-40 ellipsis-text">
                  {url}
                </div>
              </div>
              <div>
                <CustomMenu
                  trigger={<EllipsisVertical size={16} />}
                  content={[
                    {
                      items: [
                        {
                          label: <div>Remove</div>,
                          className: "text-destructive font-semibold",
                          async onClick() {
                            await removeRecentlyVisited(url ?? "");
                            fetchRecentlyVisitedLinks();
                          },
                        },
                      ],
                    },
                  ]}
                />
              </div>
            </div>
            <Separator />
          </div>
        ))}
      </main>
    </section>
  );
};

export default RecentlyVisitedLinks;
