import clsx, { ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function shortendDescription(description: string, chars: number) {
  return `${description.slice(0, chars)}...`;
}

export function getStatusClasses(status: "inProgress" | "open" | "closed") {
  switch (status) {
    case "inProgress":
      return "bg-yellow-200 text-yellow-800";
    case "open":
      return "bg-green-200 text-green-800";
    case "closed":
      return "bg-red-200 text-red-800";
    default:
      return "";
  }
}

export function getPriorityClasses(priority: "low" | "mid" | "high") {
  switch (priority) {
    case "low":
      return "bg-yellow-200 text-yellow-800";
    case "mid":
      return "bg-orange-200 text-orange-800";
    case "high":
      return "bg-red-200 text-red-800";
    default:
      return "";
  }
}
