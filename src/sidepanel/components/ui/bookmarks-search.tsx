import { cn } from "@/utils";
import CustomInput from "./custom-input";

interface Props {
  className?: string;
}

const BookmarkSearch = ({ className }: Props) => {
  return (
    <div>
      <CustomInput
        className={cn(className, "rounded-lg")}
        placeholder="Search for Bookmarks..."
      />
    </div>
  );
};

export default BookmarkSearch;
