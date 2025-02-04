import Navbar from "./navbar";
import { STORE_KEY } from "@/constants";
import { ThemeProvider } from "../providers/theme-provider";
import { SidebarProvider } from "../ui/sidebar";

interface Props {
  children: React.ReactElement;
}

const DefaultLayout = ({ children }: Props) => {
  return (
    <ThemeProvider storageKey={STORE_KEY.SIDEBAR_THEME}>
      <SidebarProvider className="block" defaultOpen={false}>
        <div className="flex flex-col p-4 px-6 text-base font-default">
          <Navbar />
          {children}
        </div>
      </SidebarProvider>
    </ThemeProvider>
  );
};

export default DefaultLayout;
