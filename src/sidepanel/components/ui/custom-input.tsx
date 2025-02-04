import { cn } from "@/utils";
import { Input } from "./input";
import { useAtom } from "jotai";
import { settingsAtom } from "@/sidepanel/store/settings";
import { InputHTMLAttributes } from "react";

const CustomInput: React.FC<InputHTMLAttributes<HTMLInputElement>> = ({
  ...props
}) => {
  const [settings] = useAtom(settingsAtom);

  return (
    <Input
      {...props}
      className={cn(
        props.className,
        "text-base px-5 bg-accent placeholder:text-sm",
        {
          "focus-visible:ring-0": !settings.highlightInput,
        }
      )}
    />
  );
};

export default CustomInput;
