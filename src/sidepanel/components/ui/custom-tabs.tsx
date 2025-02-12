import { cn } from "@/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs";

interface Props {
  className?: string;
  defaultValue?: string;
  tabs: {
    name: string;
    title: string;
    content: React.ReactElement | string;
    hidden?: boolean;
  }[];
}

const CustomTabs = ({ tabs, defaultValue, className }: Props) => {
  defaultValue = defaultValue || tabs.find(({ hidden }) => !hidden)?.name;

  return (
    <Tabs defaultValue={defaultValue} className={cn(className, "w-full")}>
      <TabsList className="bg-transparent flex gap-2  justify-start px-0 pb-0">
        {tabs.map(
          ({ name, title, hidden }) =>
            !hidden && (
              <TabsTrigger className="font-light px-0" value={name}>
                {title}
              </TabsTrigger>
            )
        )}
      </TabsList>
      {tabs.map(
        ({ name, content, hidden }) =>
          !hidden && (
            <TabsContent className="mt-4" value={name}>
              {content}
            </TabsContent>
          )
      )}
    </Tabs>
  );
};

export default CustomTabs;
