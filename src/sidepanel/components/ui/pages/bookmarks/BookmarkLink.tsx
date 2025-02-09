import { cn, copyToClipboard, navigateWindowTo } from "@/utils";
import { Bookmark, DraggedItem } from "@/models";
import { titleCase } from "title-case";
import { bookmarkHelpers } from "@/sidepanel/store/useBookmark";
import { useDrag } from "react-dnd";
import { DRAGGABLE_ITEMS } from "@/constants";

interface Props {
  bookmark: Bookmark;
  className?: string;
  iconSize: number;
}

const BookmarkLink = ({ bookmark, className, iconSize }: Props) => {
  const [{ isDragging }, drag] = useDrag<
    DraggedItem,
    unknown,
    { isDragging: boolean }
  >(() => ({
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
    <div
      ref={drag}
      className={cn(
        className,
        "flex items-center gap-2 opacity-80 text-xs text-nowrap hover:opacity-100 transition-opacity cursor-pointer w-full",
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
      <div className="ellipsis-text">{titleCase(bookmark.title)}</div>
    </div>
  );
};

export default BookmarkLink;
