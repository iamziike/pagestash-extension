import { Fragment } from "react/jsx-runtime";
import { cn } from "@/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./dropdown-menu";

interface Props {
  trigger: React.ReactElement | string;
  content: {
    title?: React.ReactElement | string;
    items: {
      label: React.ReactElement;
      onClick?: React.MouseEventHandler<HTMLDivElement>;
      className?: string;
      variant?: "danger" | "warning" | "default";
      hidden?: boolean;
    }[];
  }[];
}

const CustomMenu = ({ content, trigger }: Props) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>{trigger}</DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {content.map(({ items, title }, index) => (
          <Fragment key={index}>
            {title && (
              <>
                <DropdownMenuLabel>{title}</DropdownMenuLabel>
                <DropdownMenuSeparator />
              </>
            )}
            {items.map(
              (
                { label, onClick, className, variant = "default", hidden },
                index
              ) =>
                !hidden && (
                  <DropdownMenuItem
                    className={cn(
                      "text-xs hover:font-semibold hover:bg-accent hover:text-accent-foreground [&>*]:w-full p-0 [&>*]:px-2 [&>*]:py-1.5",
                      {
                        "text-destructive hover:text-destructive focus:text-destructive [&>*]:focus:text-destructive":
                          variant === "danger",
                      },
                      className
                    )}
                    onClick={onClick}
                    key={index}
                  >
                    {label}
                  </DropdownMenuItem>
                )
            )}
          </Fragment>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default CustomMenu;
