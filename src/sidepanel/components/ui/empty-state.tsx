import { BookmarkPlus } from "lucide-react";

interface Props {
  visible?: boolean;
  title: string;
  description: React.ReactElement | string;
}

const EmptyState = ({ visible = true, title, description }: Props) => {
  return (
    visible && (
      <div className="flex flex-col items-center justify-center px-4 mt-3">
        <div className="bg-gray-800 rounded-full p-4 mb-4">
          <BookmarkPlus className="w-8 h-8 text-gray-400" />
        </div>

        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-gray-400 text-center text-sm max-w-xs">
          {description}
        </p>
      </div>
    )
  );
};

export default EmptyState;
