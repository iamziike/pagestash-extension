import useSettings from "@/sidepanel/store/useSettings";
import { forwardRef, InputHTMLAttributes } from "react";
import { cn } from "@/utils";
import { Input } from "./input";
import { SendHorizonal } from "lucide-react";
import { Button } from "./button";

export interface CustomInputProps
  extends InputHTMLAttributes<HTMLInputElement> {
  isIconHidden?: boolean;
  onClear?: VoidFunction;
}

const CustomInput = forwardRef<HTMLInputElement, CustomInputProps>(
  ({ isIconHidden, onClear, ...props }, ref) => {
    const { highlightInput } = useSettings();

    return (
      <div className="flex items-center w-full bg-accent rounded-md overflow-hidden ps-1 pe-2">
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
            props.className,
            "text-base border-none placeholder:text-sm w-full",
            {
              "focus-visible:ring-0": !highlightInput,
            }
          )}
        />
        {!isIconHidden && (
          <Button variant="ghost" className="px-0">
            <SendHorizonal size={16} />
          </Button>
        )}
      </div>
    );
  }
);

export default CustomInput;
