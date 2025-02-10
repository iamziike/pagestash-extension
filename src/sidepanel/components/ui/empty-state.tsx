import { CircleOff } from "lucide-react";

interface Props {
  hidden: boolean;
}

const EmptyState = ({ hidden }: Props) => {
  return (
    hidden && (
      <div className="text-center flex flex-col gap-3 items-center">
        <CircleOff size={80} />
        <div className="text-2xl">Nothing To Show!!</div>
      </div>
    )
  );
};

export default EmptyState;
