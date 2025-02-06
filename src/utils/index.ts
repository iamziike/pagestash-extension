import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getSystemColorScheme = () => {
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
};

export const navigateWindowTo = (url: string) => {
  window.open(url, "_blank");
};

export const waitFor = (secs: number) =>
  new Promise((resolve) => setTimeout(resolve, secs * 1000));

