import CustomMenu from "../../custom-menu";
import useFavourite from "@/sidepanel/store/useFavourite";
import { bookmarkHelpers } from "@/sidepanel/store/useBookmark";
import { cn, copyToClipboard, navigateWindowTo } from "@/utils";
import { BookmarkNode, DraggedItem } from "@/models";
import { titleCase } from "title-case";
import { useDrag } from "react-dnd";
import { DRAGGABLE_ITEMS } from "@/constants";
import { EllipsisVertical } from "lucide-react";

interface Props {
  bookmark: BookmarkNode;
  className?: string;
  iconSize: number;
  draggable?: boolean;
  actions: {
    update: () => void;
    remove: () => void;
    favourite: () => void;
  };
}

const BookmarkLink = ({
  bookmark,
  className,
  iconSize,
  actions,
  draggable = true,
}: Props) => {
  const favourite = useFavourite();
  const [{ isDragging }, drag] = useDrag<
    DraggedItem,
    unknown,
    { isDragging: boolean }
  >(() => ({
    canDrag: draggable,
    type: DRAGGABLE_ITEMS.LINK,
    item: {
      id: bookmark?.id,
      parentId: bookmark?.parentId ?? "",
    },
    collect: (monitor) => {
      return {
        isDragging: Boolean(monitor.isDragging()),
      };
    },
  }));

  return (
    <div className="flex items-center gap-4 justify-between group">
      <div
        ref={drag}
        className={cn(
          className,
          "flex items-center gap-2 opacity-80 text-xs text-nowrap hover:opacity-100 transition-opacity cursor-pointer overflow-hidden",
          { "opacity-50": isDragging }
        )}
        onClick={() => {
          copyToClipboard(bookmark.url);
          navigateWindowTo(bookmark.url ?? "");
        }}
      >
        <img
          src={bookmarkHelpers.getBookmarkFaviconURL(bookmark?.url ?? "")}
          alt="bookmark favicon"
          loading="lazy"
          width={iconSize}
        />
        <div className="ellipsis-text w-max">{titleCase(bookmark.title)}</div>
      </div>
      <div className="text-lg font-mono opacity-0 group-hover:opacity-100 transition-opacity">
        <CustomMenu
          trigger={<EllipsisVertical size={16} />}
          content={[
            {
              items: [
                {
                  label: <div>Update</div>,
                  onClick: actions.update,
                },
              ],
            },
            {
              items: [
                {
                  hidden: favourite.has(bookmark.id, "link"),
                  label: <div>Add to Favourite</div>,
                  onClick: actions.favourite,
                },
              ],
            },
            {
              items: [
                {
                  label: <div>Remove</div>,
                  className: "text-destructive font-semibold",
                  onClick: actions.remove,
                },
              ],
            },
          ]}
        />
      </div>
    </div>
  );
};

export default BookmarkLink;
