import { atom } from "jotai";

interface Settings {
  theme: "dark" | "light" | "system" | "red-moon";
  highlightInput: boolean;
}

export const settingsAtom = atom<Settings>({
  theme: "system",
  highlightInput: false,
});
