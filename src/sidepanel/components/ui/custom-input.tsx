import useSettings from "@/sidepanel/store/useSettings";
import { InputHTMLAttributes } from "react";
import { cn } from "@/utils";
import { Input } from "./input";

const CustomInput: React.FC<InputHTMLAttributes<HTMLInputElement>> = ({
  ...props
}) => {
  const { highlightInput } = useSettings();

  return (
    <Input
      {...props}
      className={cn(
        props.className,
        "text-base px-5 bg-accent placeholder:text-sm",
        {
          "focus-visible:ring-0": !highlightInput,
        }
      )}
    />
  );
};

export default CustomInput;
