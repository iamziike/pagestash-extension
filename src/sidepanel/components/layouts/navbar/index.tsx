import { CirclePlus } from "lucide-react";
import Logo from "../../ui/logo";
import CustomSidebar from "./custom-sidebar";

const Navbar = () => {
  return (
    <nav className="flex gap-3 justify-between items-center py-2">
      <CustomSidebar />
      <div className="w-40 sm:w-52">
        <Logo />
      </div>
      <CirclePlus size={24} strokeWidth={2} />
    </nav>
  );
};

export default Navbar;
