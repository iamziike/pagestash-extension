import BookmarkLink from "./BookmarkLink";
import useBookmark from "@/sidepanel/store/useBookmark";
import { cn } from "@/utils";
import { Bookmark, DraggedItem } from "@/models";
import { useDrag, useDrop } from "react-dnd";
import { DRAGGABLE_ITEMS } from "@/constants";
import { BanIcon, Folder, FolderOpen } from "lucide-react";
import { titleCase } from "title-case";
import { useState } from "react";

interface Props {
  data: Bookmark;
}

const CollapsibleBookmark = ({ data }: Props) => {
  const { moveBookmark } = useBookmark();
  const [isFolderContentVisible, setIsFolderContentVisible] = useState(false);

  const [, drop] = useDrop(
    () => ({
      accept: [DRAGGABLE_ITEMS.LINK, DRAGGABLE_ITEMS.FOLDER],
      drop: (draggedItem: DraggedItem, monitor) => {
        const isTarget = !monitor.didDrop();
        if (isTarget && draggedItem?.parentId !== data?.id) {
          setIsFolderContentVisible(true);
          moveBookmark(draggedItem.id, {
            parentId: data?.id,
            index: 0,
          });
        }
      },
    }),
    []
  );

  const [{ isDragging }, drag] = useDrag<
    DraggedItem,
    unknown,
    { isDragging: boolean }
  >(() => ({
    type: DRAGGABLE_ITEMS.FOLDER,
    item: {
      id: data?.id,
      parentId: data?.parentId ?? "",
    },
    collect: (monitor) => {
      return {
        isDragging: Boolean(monitor.isDragging()),
      };
    },
  }));

  const toggleFolderOpenState = () => {
    setIsFolderContentVisible((prev) => !prev);
  };

  return (
    <div ref={drop} className="overflow-hidden text-sm">
      <div
        ref={drag}
        onClick={toggleFolderOpenState}
        className={cn("flex items-center gap-2 cursor-pointer mb-2", {
          "opacity-70": isDragging,
        })}
      >
        {isFolderContentVisible ? (
          <FolderOpen size={18} />
        ) : (
          <Folder size={18} />
        )}

        {titleCase(data.title || "Unamed Folder")}
      </div>

      <div
        className={cn(
          "ms-[26px] max-h-0 transition-all duration-100 ease-in-out",
          {
            "max-h-[20000px]": isFolderContentVisible,
          }
        )}
      >
        {data?.children?.map((bookmark) => {
          if (bookmark.url?.length) {
            return (
              <BookmarkLink
                key={bookmark.id}
                className="mb-2"
                bookmark={bookmark}
                iconSize={18}
              />
            );
          }

          return <CollapsibleBookmark key={bookmark.id} data={bookmark} />;
        })}

        {!data?.children?.length && (
          <div className="flex items-center gap-2 opacity-50 mb-2">
            <BanIcon size={18} />
            <span className="text-xs">Nothing To See</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default CollapsibleBookmark;
