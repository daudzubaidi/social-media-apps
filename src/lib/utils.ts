import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatRelativeTime(date: string): string {
  const value = dayjs(date);
  const now = dayjs();

  const minutes = now.diff(value, "minute");
  if (minutes < 1) return "Just Now";
  if (minutes < 60) {
    return `${minutes} Minute${minutes === 1 ? "" : "s"} Ago`;
  }

  const hours = now.diff(value, "hour");
  if (hours < 24) {
    return `${hours} Hour${hours === 1 ? "" : "s"} Ago`;
  }

  const days = now.diff(value, "day");
  if (days < 7) {
    return `${days} Day${days === 1 ? "" : "s"} Ago`;
  }

  const weeks = now.diff(value, "week");
  if (weeks < 5) {
    return `${weeks} Week${weeks === 1 ? "" : "s"} Ago`;
  }

  const months = now.diff(value, "month");
  if (months < 12) {
    return `${months} Month${months === 1 ? "" : "s"} Ago`;
  }

  const years = now.diff(value, "year");
  return `${years} Year${years === 1 ? "" : "s"} Ago`;
}
