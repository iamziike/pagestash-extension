import Navbar from "./navbar";
import { STORE_KEY } from "@/constants";
import { ThemeProvider } from "../providers/theme-provider";
import { SidebarProvider } from "../ui/sidebar";
import { Toaster } from "../ui/sonner";

interface Props {
  children: React.ReactElement;
}

const DefaultLayout = ({ children }: Props) => {
  return (
    <ThemeProvider storageKey={STORE_KEY.SIDEBAR_THEME}>
      <SidebarProvider className="block" defaultOpen={false}>
        <div className="flex flex-col px-6 text-base font-default max-w-2xl mx-auto">
          <Navbar />
          {children}
        </div>
        <Toaster />
      </SidebarProvider>
    </ThemeProvider>
  );
};

export default DefaultLayout;
