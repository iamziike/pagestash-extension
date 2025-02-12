import { Bookmark } from "@/models";

export type BookmarkFormState =
  | {
      action: "update";
      variant: "folder" | "link";
      bookmark: Bookmark;
    }
  | {
      action: "create";
      parentId: string;
    };
