import { bookmarkHelpers } from "@/sidepanel/store/useBookmark";
import { copyToClipboard, navigateWindowTo } from "@/utils";
import { titleCase } from "title-case";
import { Separator } from "../../separator";

interface Props {
  url?: string;
  title?: string;
}

const HomeLink = ({ url, title }: Props) => {
  return (
    <div
      className="group cursor-pointer"
      onClick={() => {
        copyToClipboard(url);
        navigateWindowTo(url ?? "");
      }}
    >
      <div className="group-hover:opacity-60 transition-opacity flex gap-3 items-start py-1 pb-2">
        <img
          src={bookmarkHelpers.getBookmarkFaviconURL(url ?? "")}
          alt="bookmark favicon"
          loading="lazy"
          width={24}
        />
        <div className="w-full text-ellipsis overflow-hidden">
          <p className="ellipsis-text text-sm">
            {titleCase(title ?? "Unamed")}
          </p>
          <p className="text-[11px] opacity-40 ellipsis-text">{url}</p>
        </div>
        <span className="text-lg font-mono">→</span>
      </div>
      <Separator />
    </div>
  );
};

export default HomeLink;
