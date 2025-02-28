import { SelectProps } from "@radix-ui/react-select";
import { InputHTMLAttributes } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";

type Props = InputHTMLAttributes<HTMLSelectElement> &
  SelectProps & {
    placeholder: string;
    options: { label: string; value: string }[];
  };

const CustomSelect = ({ options, placeholder, ...props }: Props) => {
  return (
    <Select onValueChange={props.onValueChange}>
      <SelectTrigger>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options?.map((option) => (
          <SelectItem value={option?.value}>{option.label}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default CustomSelect;
