import useSettings from "@/sidepanel/store/useSettings";
import { forwardRef, InputHTMLAttributes } from "react";
import { cn } from "@/utils";
import { Input } from "./input";
import { SendHorizonal } from "lucide-react";
import { Button } from "./button";

export interface CustomInputProps
  extends InputHTMLAttributes<HTMLInputElement> {
  onClear?: VoidFunction;
  iconClassName?: string;
  wrapperClassName?: string;
}

const CustomInput = forwardRef<HTMLInputElement, CustomInputProps>(
  ({ onClear, wrapperClassName, iconClassName, ...props }, ref) => {
    const { highlightInput } = useSettings();

    return (
      <div
        className={cn(
          "flex items-center w-full bg-accent rounded-md overflow-hidden ps-1 pe-2",
          wrapperClassName
        )}
      >
        <Input
          {...props}
          ref={ref}
          onChange={(event) => {
            props.onChange?.(event);
            if (!event.target.value.length && onClear) {
              onClear();
            }
          }}
          className={cn(
            "text-base border-none placeholder:text-sm w-full",
            {
              "focus-visible:ring-0": !highlightInput,
            },
            props.className
          )}
        />
        <Button variant="ghost" className={cn("px-0", iconClassName)}>
          <SendHorizonal size={16} />
        </Button>
      </div>
    );
  }
);

export default CustomInput;
