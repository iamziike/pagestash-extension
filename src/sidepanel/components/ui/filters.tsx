import DatePickerWithRange from "./date-picker";
import { cn } from "@/utils";
import { Label } from "./label";
import { useSearchParams } from "react-router-dom";
import { SlidersHorizontal } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./accordion";

interface Props {
  className?: string;
  title: string;
  filters: Readonly<
    {
      type: "input" | "date-range";
      label: string;
      name: string;
    }[]
  >;
}

const Filters = ({ filters, title, className }: Props) => {
  const [searchParams, setSearchParams] = useSearchParams();

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
                  const dates = searchParams.getAll(filterName);
                  const from = dates[0] && new Date(dates[0]);
                  const to = dates[1] && new Date(dates[1]);

                  return (
                    <Label key={filter.name} className="space-y-2 flex-1">
                      <div>{filter?.label}</div>
                      <DatePickerWithRange
                        // className="border border-r"
                        restrictDaysAfterToday
                        value={{ from, to }}
                        onChange={(value) => {
                          searchParams.delete(filterName);

                          if (value?.from) {
                            searchParams.append(
                              filterName,
                              value?.from?.toISOString()
                            );
                          }

                          if (value?.to) {
                            searchParams.append(
                              filterName,
                              value?.to?.toISOString()
                            );
                          }

                          setSearchParams(searchParams);
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
