import clsx, { ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function shortendDescription(description: string, chars: number) {
  return `${description.slice(0, chars)}...`;
}
