import { v4 as uuidv4 } from "uuid";
import { clsx, type ClassValue } from "clsx";
import { isValid } from "date-fns";
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

export const getEndOfDay = (date: Date) => {
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);
  return endOfDay;
};

export const getAllSearchParams = <T>(searchParams: URLSearchParams) => {
  return Object.fromEntries(searchParams.entries()) as T;
};

export const toDate = (value?: string | Date | null) => {
  const date = new Date(value || "");
  return isValid(date) ? date : undefined;
};

export const getCurrentTab = async () => {
  const tab = (
    await chrome.tabs.query({ active: true, currentWindow: true })
  )?.[0];

  return {
    title: tab?.title,
    url: tab?.url,
  };
};

export const getRandomID = () => {
  return uuidv4();
};

export const calculatePercentage = (part: number, total: number) => {
  return (part / total) * 100;
};

export const isWithinDateRange = (
  date: Date,
  range: { from?: string | null; end?: string | null }
) => {
  const { end, from } = range;

  if (!from || !end) {
    return null;
  }

  return date >= new Date(from) && date <= new Date(end);
};

export const isObjectValuesTruthy = (values: unknown[]) => {
  return Boolean((values || []).filter(Boolean).length);
};

