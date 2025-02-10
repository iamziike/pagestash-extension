import CustomInput, { CustomInputProps } from "./custom-input";

const BookmarkSearch = ({ ...props }: CustomInputProps) => {
  return (
    <div className="flex items-center justify-between ">
      <CustomInput {...props} placeholder="Search for Bookmarks..." />
    </div>
  );
};

export default BookmarkSearch;
