import { Fragment } from "react/jsx-runtime";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { cn } from "@/utils";

interface Props {
  trigger: React.ReactElement | string;
  content: {
    title?: React.ReactElement | string;
    items: {
      label: React.ReactElement | string;
      onClick: VoidFunction;
      className?: string;
    }[];
  }[];
}

const CustomMenu = ({ content, trigger }: Props) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>{trigger}</DropdownMenuTrigger>
      <DropdownMenuContent>
        {content.map(({ items, title }, index) => (
          <Fragment key={index}>
            {title && (
              <>
                <DropdownMenuLabel>{title}</DropdownMenuLabel>
                <DropdownMenuSeparator />
              </>
            )}
            {items.map(({ label, onClick, className }, index) => (
              <DropdownMenuItem
                className={cn("font-light", className)}
                onClick={onClick}
                key={index}
              >
                {label}
              </DropdownMenuItem>
            ))}
          </Fragment>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default CustomMenu;
