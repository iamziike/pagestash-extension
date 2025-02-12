import Logo from "../../ui/logo";
import CustomSidebar from "./custom-sidebar";
import CustomModal from "../../ui/custom-modal";
import CustomTabs from "../../ui/custom-tabs";
import BookmarkLinkForm from "../../ui/pages/bookmarks/bookmark-link-form";
import useBookmark from "@/sidepanel/store/useBookmark";
import { useState } from "react";
import { CirclePlus } from "lucide-react";

const Navbar = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { bookmark } = useBookmark();

  return (
    <>
      <CustomModal
        isOpen={isFormOpen}
        onOpenChange={() => setIsFormOpen(false)}
      >
        <CustomTabs
          className="mt-1"
          tabs={[
            {
              name: "Link",
              title: "Manage Link",
              content: (
                <BookmarkLinkForm
                  action="create"
                  parentId={bookmark?.children?.[0]?.id}
                  onComplete={() => setIsFormOpen(false)}
                />
              ),
            },
          ]}
        />
      </CustomModal>
      <nav className="sticky top-0 left-0 w-full bg-background flex gap-3 justify-between items-center pt-4 py-2 z-50">
        <CustomSidebar />
        <div className="w-40 sm:w-52">
          <Logo />
        </div>
        <CirclePlus
          className="cursor-pointer"
          size={24}
          strokeWidth={2}
          onClick={() => setIsFormOpen(true)}
        />
      </nav>
    </>
  );
};

export default Navbar;
