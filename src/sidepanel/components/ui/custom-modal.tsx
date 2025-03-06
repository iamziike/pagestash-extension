import { cn } from "@/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTrigger,
  DialogTitle,
} from "./dialog";

interface Props {
  trigger?: React.ReactElement;
  children: React.ReactElement | React.ReactElement[];
  size?: "medium" | "large";
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const CustomModal = ({
  trigger,
  children,
  size,
  onOpenChange,
  isOpen,
}: Props) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent
        className={cn("w-11/12 rounded-sm", {
          "max-w-full md:max-w-screen-lg": size === "large",
          "max-w-full md:max-w-screen-md": size === "medium",
        })}
      >
        <div className="hidden">
          <DialogTitle />
          <DialogDescription />
        </div>
        <div className="mt-4">{children}</div>
      </DialogContent>
    </Dialog>
  );
};

export default CustomModal;
