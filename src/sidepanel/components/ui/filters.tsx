import DatePickerWithRange from "./date-picker";
import { cn, toDate } from "@/utils";
import { Label } from "./label";
import { SlidersHorizontal } from "lucide-react";
import { FilterOption } from "@/models";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./accordion";

interface Props {
  searchParams: URLSearchParams;
  onChange: (value: URLSearchParams) => void;
  className?: string;
  title: string;
  filters: Readonly<FilterOption[]>;
}

const Filters = ({
  filters,
  title,
  className,
  onChange,
  searchParams,
}: Props) => {
  return (
    <div className={cn(className)}>
      <Accordion type="single" collapsible className="mt-0">
        <AccordionItem value="item-1" className="border-b-0 mt-0">
          <div className="flex justify-between mt-0">
            <h2 className="font-extrabold text-xl">{title}</h2>
            <AccordionTrigger className="hide-accordion-icon [&[data-state=open]>svg]:rotate-90 pt-0">
              <SlidersHorizontal className="cursor-pointer active:scale-125 transition-transform " />
            </AccordionTrigger>
          </div>
          <AccordionContent>
            <form className="bg-accent px-4 py-3 rounded-md flex justify-between flex-wrap gap-3">
              {filters.map((filter) => {
                if (filter.type === "date-range") {
                  const filterName = filter.name;
                  const secondaryFilterName = filter.secondaryName!;
                  const from = toDate(searchParams.get(filterName));
                  const to = toDate(searchParams.get(secondaryFilterName));

                  return (
                    <Label key={filter.name} className="space-y-2 flex-1">
                      <div>{filter?.label}</div>
                      <DatePickerWithRange
                        restrictDaysAfterToday
                        value={{ from, to }}
                        onChange={(value) => {
                          searchParams.delete(filterName);
                          searchParams.delete(secondaryFilterName);
                          if (value?.from) {
                            searchParams.append(
                              filterName,
                              value?.from?.toISOString()
                            );
                          }
                          if (value?.to) {
                            searchParams.append(
                              secondaryFilterName,
                              value?.to?.toISOString()
                            );
                          }

                          onChange(searchParams);
                        }}
                      />
                    </Label>
                  );
                }
              })}
            </form>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default Filters;
