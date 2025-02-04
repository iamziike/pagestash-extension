import { MoonStar, Sun } from "lucide-react";
import { Switch } from "./switch";
import { useTheme } from "../providers/theme-provider";

const ThemeSelect = () => {
  const { setTheme, colorScheme } = useTheme();

  const toggleTheme = () => {
    setTheme(colorScheme === "dark" ? "light" : "dark");
  };

  return (
    <div
      className="flex items-center gap-7 text-xl cursor-pointer w-max"
      onClick={toggleTheme}
    >
      {colorScheme === "dark" ? (
        <div className="flex gap-3 items-center">
          <MoonStar />
          <span>Dark Mode</span>
        </div>
      ) : (
        <div className="flex gap-3 items-center">
          <Sun />
          <span>Light Mode</span>
        </div>
      )}
      <Switch className="scale-150" checked={colorScheme === "dark"} />
    </div>
  );
};

export default ThemeSelect;
