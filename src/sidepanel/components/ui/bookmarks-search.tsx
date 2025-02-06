import CustomInput from "./custom-input";
import { cn } from "@/utils";

const BookmarkSearch = ({
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) => {
  return (
    <div>
      <CustomInput
        {...props}
        className={cn(className, "rounded-lg")}
        placeholder="Search for Bookmarks..."
      />
    </div>
  );
};

export default BookmarkSearch;
