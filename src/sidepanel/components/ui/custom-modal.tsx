import { cn } from "@/utils";
import { Dialog, DialogContent, DialogTrigger } from "./dialog";

interface Props {
  trigger: React.ReactElement;
  children: React.ReactElement | React.ReactElement[];
  isOpen?: boolean;
  onClose?: VoidFunction;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
}

const CustomModal = ({
  trigger,
  isOpen,
  children,
  size = "md",
  onClose,
}: Props) => {
  return (
    <Dialog
      open={isOpen}
      onOpenChange={(state) => {
        if (!state) {
          onClose?.();
        }
      }}
    >
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent
        className={cn({
          "max-w-xs": size === "xs",
          "max-w-sm": size === "sm",
          "max-w-md": size === "md",
          "max-w-lg": size === "lg",
          "max-w-xl": size === "xl",
        })}
      >
        <div className="mt-4">{children}</div>
      </DialogContent>
    </Dialog>
  );
};

export default CustomModal;
