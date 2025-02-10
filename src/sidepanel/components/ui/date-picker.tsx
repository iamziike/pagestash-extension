"use client";

import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { format, endOfDay } from "date-fns";
import { Button } from "./button";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "./calendar";
import { cn, getEndOfDay } from "@/utils";
import { DateRange } from "react-day-picker";

interface Props {
  className?: string;
  restrictDaysAfterToday?: boolean;
  onChange: (value?: DateRange) => void;
  value: Partial<{
    from: Date;
    to: Date;
  }> | null;
}

const DatePickerWithRange = ({
  className,
  onChange,
  value,
  restrictDaysAfterToday,
}: Props) => {
  const from = value?.from;
  const to = value?.to;

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            className={cn(
              "justify-start text-left font-normal hover:bg-background",
              !value && "text-muted-foreground"
            )}
          >
            <CalendarIcon />
            {from ? (
              to ? (
                <>
                  {format(from, "LLL dd, y")} - {format(to, "LLL dd, y")}
                </>
              ) : (
                format(from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="range"
            onSelect={onChange}
            selected={{ from: from, to: to && getEndOfDay(to) }}
            classNames={{
              day_today: cn({
                "bg-transparent": from || to,
                "bg-accent text-accent-foreground": !(from || to),
              }),
            }}
            toDate={restrictDaysAfterToday ? endOfDay(new Date()) : undefined}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default DatePickerWithRange;
