import Logo from "../../ui/logo";
import ThemeSelect from "../../ui/theme-select";
import CustomSearch from "../../ui/custom-search";
import { Separator } from "../../ui/separator";
import { PAGES } from "@/constants";
import { PanelLeft } from "lucide-react";
import { cn } from "@/utils";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenuItem,
  useSidebar,
} from "../../ui/sidebar";

const LINKS = [PAGES.HOME, PAGES.BOOKMARKS, PAGES.CREDENTIALS];

const CustomSidebar = () => {
  const { toggleSidebar } = useSidebar();
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <>
      <PanelLeft
        className="cursor-pointer"
        onClick={toggleSidebar}
        size={24}
        strokeWidth={2}
      />
      <div className={cn("fixed top-0 left-0 z-50")}>
        <Sidebar collapsible="offcanvas">
          <SidebarHeader className="flex justify-between pt-5 px-4 flex-row items-center gap-4">
            <div className="w-44">
              <Logo className="fill-sidebar-primary" />
            </div>
            <PanelLeft
              className="cursor-pointer"
              onClick={toggleSidebar}
              size={24}
              strokeWidth={2}
            />
          </SidebarHeader>
          <SidebarContent className="pt-5 px-4">
            <SidebarGroup className="p-0">
              <CustomSearch
                placeholder="Search for Bookmarks..."
                className="selection:bg-sidebar-primary selection:text-sidebar-primary-foreground"
                onChange={({ query }) => {
                  if (query) {
                    const searchParams = new URLSearchParams();
                    searchParams.set("query", query?.trim());
                    navigate(
                      `${PAGES.BOOKMARKS.path}?${searchParams.toString()}`
                    );
                    toggleSidebar();
                  }
                }}
              />
            </SidebarGroup>
            <SidebarGroup className="mt-4 space-y-5">
              {LINKS.map(({ path, label, icon: Icon }) => (
                <SidebarMenuItem className={cn("list-none")} key={path}>
                  <NavLink
                    to={path}
                    onClick={toggleSidebar}
                    className={cn(
                      "flex items-center gap-4 text-xl p-3 hover:bg-sidebar-primary hover:text-sidebar-primary-foreground rounded-md cursor-pointer",
                      {
                        "bg-sidebar-primary text-sidebar-primary-foreground":
                          path === location.pathname,
                      }
                    )}
                  >
                    <span>{<Icon />}</span>
                    <span>{label}</span>
                  </NavLink>
                </SidebarMenuItem>
              ))}
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter className="px-4">
            <Separator />
            <SidebarGroup className="py-5 px-3">
              <ThemeSelect />
            </SidebarGroup>
          </SidebarFooter>
        </Sidebar>
      </div>
    </>
  );
};

export default CustomSidebar;
