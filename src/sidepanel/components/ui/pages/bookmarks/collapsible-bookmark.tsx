import BookmarkLink from "./BookmarkLink";
import useBookmark from "@/sidepanel/store/useBookmark";
import CustomMenu from "../../custom-menu";
import CustomModal from "../../custom-modal";
import CustomTabs from "../../custom-tabs";
import BookmarkFolderForm from "./bookmark-folder-form";
import BookmarkLinkForm from "./bookmark-link-form";
import useFavourite from "@/sidepanel/store/useFavourite";
import { cn } from "@/utils";
import { useDrag, useDrop } from "react-dnd";
import { DRAGGABLE_ITEMS } from "@/constants";
import { titleCase } from "title-case";
import { useState } from "react";
import { BookmarkFormState } from "@/models";
import { toast } from "sonner";
import { BookmarkNode, DraggedItem } from "@/models";
import {
  BanIcon,
  EllipsisVertical,
  Folder,
  FolderClosed,
  FolderOpen,
} from "lucide-react";

interface Props {
  data: BookmarkNode;
  isDefaultOpen?: boolean;
  isRoot?: boolean;
}

const CollapsibleBookmark = ({ data, isDefaultOpen = false }: Props) => {
  const isRoot = !data?.parentId;
  const isRootChildren = data?.parentId === "0";
  const favourite = useFavourite();
  const { moveBookmark, removeBookmark } = useBookmark();
  const [formAction, setFormAction] = useState<BookmarkFormState | null>(null);
  const [isFolderContentVisible, setIsFolderContentVisible] =
    useState(isDefaultOpen);

  const [, drop] = useDrop(
    () => ({
      accept: [DRAGGABLE_ITEMS.LINK, DRAGGABLE_ITEMS.FOLDER],
      canDrop() {
        return !isRoot;
      },
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

  const getFolderIconRender = () => {
    if (isFolderContentVisible) {
      return <FolderOpen size={18} />;
    }

    if (data?.children?.length) {
      return <FolderClosed size={18} />;
    }

    return <Folder size={18} />;
  };

  return (
    <>
      <CustomModal
        isOpen={Boolean(formAction)}
        onOpenChange={() => setFormAction(null)}
      >
        <CustomTabs
          className="mt-1"
          tabs={[
            {
              name: "Link",
              title: "Manage Link",
              hidden:
                formAction?.action === "update" &&
                formAction.variant === "folder",
              content: (
                <BookmarkLinkForm
                  {...formAction}
                  onComplete={() => setFormAction(null)}
                />
              ),
            },
            {
              name: "Folder",
              title: "Manage Folder",
              hidden:
                formAction?.action === "update" &&
                formAction.variant === "link",
              content: (
                <BookmarkFolderForm
                  {...formAction}
                  onComplete={() => {
                    setFormAction(null);
                  }}
                />
              ),
            },
          ]}
        />
      </CustomModal>

      <div ref={drop} className="overflow-hidden text-sm">
        <div className="flex justify-between items-center group">
          <div
            ref={drag}
            onClick={toggleFolderOpenState}
            className={cn("flex items-center gap-2 cursor-pointer mb-2", {
              "opacity-70": isDragging,
            })}
          >
            {getFolderIconRender()}
            {isRoot ? "Bookmarks" : titleCase(data.title || "Unamed Folder")}
          </div>

          {!isRoot && (
            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
              <CustomMenu
                trigger={<EllipsisVertical size={16} />}
                content={[
                  {
                    items: [
                      {
                        label: <div>New</div>,
                        async onClick() {
                          setIsFolderContentVisible(true);
                          setFormAction({
                            action: "create",
                            parent: data,
                          });
                        },
                      },
                      {
                        hidden: isRootChildren,
                        label: <div>Update</div>,
                        async onClick() {
                          setIsFolderContentVisible(true);
                          setFormAction({
                            action: "update",
                            bookmark: data,
                            variant: "folder",
                          });
                        },
                      },
                      {
                        hidden: favourite.has(data.id, "folder"),
                        label: <div>Add to Favourite</div>,
                        async onClick() {
                          setIsFolderContentVisible(true);
                          favourite.add({
                            id: data.id,
                            type: "folder",
                          });
                          toast("Added to Favourites");
                        },
                      },
                      {
                        hidden: isRootChildren,
                        label: <div>Remove</div>,
                        variant: "danger",
                        async onClick() {
                          setIsFolderContentVisible(false);
                          await removeBookmark(data.id, "folder");
                          if (favourite.has(data.id, "folder")) {
                            favourite.delete(data.id, "folder");
                          }
                        },
                      },
                    ],
                  },
                ]}
              />
            </div>
          )}
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
            if (bookmark.url) {
              return (
                <BookmarkLink
                  key={bookmark.id}
                  className="mb-2"
                  bookmark={bookmark}
                  iconSize={18}
                  actions={{
                    favourite() {
                      favourite.add({
                        id: bookmark.id,
                        type: "link",
                      });
                      toast("Added to Favourites");
                    },
                    async remove() {
                      await removeBookmark(bookmark.id, "link");
                      if (favourite.has(data.id, "link")) {
                        favourite.delete(data.id, "link");
                      }
                    },
                    update() {
                      setFormAction({
                        bookmark,
                        action: "update",
                        variant: "link",
                      });
                    },
                  }}
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
    </>
  );
};

export default CollapsibleBookmark;
