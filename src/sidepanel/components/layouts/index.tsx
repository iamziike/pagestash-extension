import Navbar from "./navbar";
import { STORE_KEY } from "@/constants";
import { ThemeProvider } from "../providers/theme-provider";
import { SidebarProvider } from "../ui/sidebar";
import { Toaster } from "../ui/sonner";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

interface Props {
  children: React.ReactElement;
}

const DefaultLayout = ({ children }: Props) => {
  return (
    <ThemeProvider storageKey={STORE_KEY.SIDEBAR_THEME}>
      <SidebarProvider className="block" defaultOpen={false}>
        <DndProvider backend={HTML5Backend}>
          <div className="flex flex-col px-6 text-base font-default max-w-2xl mx-auto h-screen">
            <Navbar />
            <div className="flex-1 hidden-scrollbar">{children}</div>
          </div>
          <Toaster />
        </DndProvider>
      </SidebarProvider>
    </ThemeProvider>
  );
};

export default DefaultLayout;
