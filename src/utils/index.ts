import { clsx, type ClassValue } from "clsx";
import { toast } from "sonner";
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

export const copyToClipboard = (text?: string) => {
  navigator.clipboard.writeText(text ?? "").then(
    () => {
      toast("URL copied to clipboard");
    },
    () => {
      toast("Failed to copy URL to clipboard");
    }
  );
};

