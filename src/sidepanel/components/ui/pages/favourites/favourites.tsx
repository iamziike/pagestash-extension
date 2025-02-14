import useFavourite from "@/sidepanel/store/useFavourite";
import CustomTabs from "../../custom-tabs";
import useBookmark from "@/sidepanel/store/useBookmark";
import CustomTooltip from "../../custom-tooltip";
import EmptyState from "../../empty-state";
import { useCallback, useEffect, useState } from "react";
import { BookmarkNode } from "@/models";
import { titleCase } from "title-case";
import { cn, copyToClipboard, navigateWindowTo } from "@/utils";
import { Link, useNavigate } from "react-router-dom";
import { PAGES } from "@/constants";

interface FavouriteItemProps {
  id: string;
  type: "link" | "folder";
}

const FavouriteItem = ({ id, type }: FavouriteItemProps) => {
  const navigate = useNavigate();
  const { getBookmark } = useBookmark();
  const [details, setDetails] = useState<BookmarkNode | null>(null);

  const fetchDetails = useCallback(async () => {
    const bookmark = await getBookmark(id);
    setDetails(bookmark);
  }, [getBookmark, id]);

  useEffect(() => {
    fetchDetails();
  }, [fetchDetails]);

  return (
    <CustomTooltip content={titleCase(details?.title ?? "")}>
      <div
        className="bg-secondary h-20 text-sm rounded-md flex justify-center items-center text-nowrap cursor-pointer px-3 group"
        onClick={() => {
          if (type === "link") {
            copyToClipboard(details?.url);
            navigateWindowTo(details?.url ?? "");
            return;
          }

          navigate(`${PAGES.BOOKMARKS.path}/${details?.id}`);
        }}
      >
        <div className="overflow-hidden group-hover:scale-90 transition-all">
          <p className="ellipsis-text">{titleCase(details?.title ?? "")}</p>
          <p className="opacity-50 text-[9px]">{details?.url}</p>
        </div>
      </div>
    </CustomTooltip>
  );
};

const Favourites = () => {
  const { data } = useFavourite();
  const folderFavourites = Object.keys(data.folder);
  const linkFavourites = Object.keys(data.link);

  return (
    <>
      <h2 className="font-extrabold text-xl">My Favourites</h2>

      {!folderFavourites.length && !linkFavourites.length ? (
        <Link to={PAGES.BOOKMARKS.path}>
          <EmptyState
            description="Start adding your favorite bookmarks here for quick access"
            title="No favourites yet"
          />
        </Link>
      ) : (
        <CustomTabs
          className="mt-1"
          tabs={[
            {
              hidden: linkFavourites.length < 1,
              content: (
                <div
                  className={cn(
                    "grid grid-rows-1 auto-cols-[calc(50%-6px)] grid-flow-col gap-3 min-w-full overflow-x-auto",
                    {
                      "grid-rows-2": linkFavourites.length > 2,
                      "pb-2": linkFavourites.length > 4,
                    }
                  )}
                >
                  {linkFavourites.map((id) => (
                    <FavouriteItem key={id} id={id} type="link" />
                  ))}
                </div>
              ),
              name: "links",
              title: "Links",
            },
            {
              hidden: folderFavourites.length < 1,
              content: (
                <div
                  className={cn(
                    "grid grid-rows-1 auto-cols-[calc(50%-6px)] grid-flow-col gap-3 min-w-full overflow-x-auto",
                    {
                      "grid-rows-2": folderFavourites.length > 2,
                      "pb-2": folderFavourites.length > 4,
                    }
                  )}
                >
                  {folderFavourites.map((id) => (
                    <FavouriteItem key={id} id={id} type="folder" />
                  ))}
                </div>
              ),
              name: "folders",
              title: "Folders",
            },
          ]}
        />
      )}
    </>
  );
};

export default Favourites;
