import Filters from "../ui/filters";
import CustomMenu from "../ui/custom-menu";
import EmptyState from "../ui/empty-state";
import useRecentlyVisited from "@/sidepanel/hooks/useRecentlyVisited";
import useTypedSearchParams from "@/sidepanel/hooks/useTypedSearchParams";
import Loading from "../ui/loading";
import { bookmarkHelpers } from "@/sidepanel/store/useBookmark";
import { titleCase } from "title-case";
import { EllipsisVertical } from "lucide-react";
import { Separator } from "@radix-ui/react-separator";
import { copyToClipboard, navigateWindowTo, toDate } from "@/utils";
import { useCallback, useEffect, useState } from "react";
import { RECENT_VISITED_LINKS_FILTERS } from "@/constants";
import {
  RecentlyVisitedLink,
  RecentlyVisitedLinkPageSearchParams,
} from "@/models";
import CustomSearch from "../ui/custom-search";

const RecentlyVisitedLinks = () => {
  const [isLoading, setisLoading] = useState(true);
  const { getRecentlyVisited, removeRecentlyVisited } = useRecentlyVisited();
  const { params, searchParams, setSearchParams } =
    useTypedSearchParams<RecentlyVisitedLinkPageSearchParams>();
  const [recentlyVisitedLinks, setRecentlyVisitedLinks] = useState<
    RecentlyVisitedLink[] | null
  >(null);

  const fetchRecentlyVisitedLinks = useCallback(async () => {
    setisLoading(true);
    const response = await getRecentlyVisited({
      query: params?.query,
      maxResults: 100,
      range: {
        from: toDate(params?.visitStartAt),
        to: toDate(params?.visitEndAt),
      },
    });
    setRecentlyVisitedLinks(response);
    setisLoading(false);
  }, [
    getRecentlyVisited,
    params?.query,
    params?.visitEndAt,
    params?.visitStartAt,
  ]);

  useEffect(() => {
    fetchRecentlyVisitedLinks();
  }, [fetchRecentlyVisitedLinks]);

  return (
    <section className="py-6 flex flex-col flex-1 h-full">
      <div>
        <CustomSearch
          placeholder="Search for Recently Visited..."
          handleSubmit={(values) => {
            if (values.query) {
              const newSearchParams = new URLSearchParams();
              newSearchParams.set("query", values.query ?? "");
              setSearchParams(newSearchParams);
              return;
            }

            setSearchParams();
          }}
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
          title="No Recent links yet"
          description={
            params?.query
              ? `No results found for "${params.query}". Try adjusting your search query.`
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
                            await removeRecentlyVisited({ url });
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
