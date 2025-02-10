import Filters from "../ui/filters";
import CustomMenu from "../ui/custom-menu";
import EmptyState from "../ui/empty-state";
import CustomInput from "../ui/custom-input";
import useRecentlyVisited from "@/sidepanel/hooks/useRecentlyVisited";
import useTypedSearchParams from "@/sidepanel/hooks/useTypedSearchParams";
import { useForm } from "react-hook-form";
import { bookmarkHelpers } from "@/sidepanel/store/useBookmark";
import { titleCase } from "title-case";
import { EllipsisVertical } from "lucide-react";
import { Separator } from "@radix-ui/react-separator";
import { copyToClipboard, navigateWindowTo, toDate } from "@/utils";
import { useCallback, useEffect, useState } from "react";
import { RECENT_VISITED_LINKS_FILTERS } from "@/utils/recently-visited/contants";
import {
  RecentlyVisitedLink,
  RecentlyVisitedLinkPageSearchParams,
} from "@/utils/recently-visited/models";

interface SearchFormValues {
  query: string | undefined;
}

const RecentlyVisitedLinks = () => {
  const { getRecentlyVisited, removeRecentlyVisited } = useRecentlyVisited();
  const { params, searchParams, setSearchParams } =
    useTypedSearchParams<RecentlyVisitedLinkPageSearchParams>();
  const { handleSubmit: onSubmit, register } = useForm({
    defaultValues: { query: params?.query },
  });
  const [recentlyVisitedLinks, setRecentlyVisitedLinks] = useState<
    RecentlyVisitedLink[] | null
  >(null);

  const fetchRecentlyVisitedLinks = useCallback(async () => {
    const response = await getRecentlyVisited({
      query: params?.query,
      maxResults: 100,
      range: {
        from: toDate(params?.visitStartAt),
        to: toDate(params?.visitEndAt),
      },
    });
    setRecentlyVisitedLinks(response);
  }, [
    getRecentlyVisited,
    params?.query,
    params?.visitEndAt,
    params?.visitStartAt,
  ]);

  const handleSubmit = (values: SearchFormValues) => {
    if (values.query) {
      const newSearchParams = new URLSearchParams();
      newSearchParams.set("query", values.query ?? "");
      setSearchParams(newSearchParams);
      return;
    }

    setSearchParams();
  };

  useEffect(() => {
    fetchRecentlyVisitedLinks();
  }, [fetchRecentlyVisitedLinks]);

  return (
    <section className="py-6 flex flex-col flex-1 h-full">
      <div>
        <form
          className="flex items-center justify-between"
          onSubmit={onSubmit(handleSubmit)}
        >
          <CustomInput
            autoComplete="off"
            placeholder="Search for Recently Visited..."
            onClear={onSubmit(handleSubmit)}
            {...register("query")}
          />
        </form>
        <Filters
          className="mt-3"
          title="My Recents"
          filters={RECENT_VISITED_LINKS_FILTERS}
          searchParams={searchParams}
          onChange={setSearchParams}
        />
      </div>
      <main className="h-full flex-1 hidden-scrollbar">
        <EmptyState hidden={recentlyVisitedLinks?.length === 0} />

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
              <div className="text-lg font-mono">
                <CustomMenu
                  trigger={<EllipsisVertical size={16} />}
                  content={[
                    {
                      items: [
                        {
                          label: "Remove",
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
