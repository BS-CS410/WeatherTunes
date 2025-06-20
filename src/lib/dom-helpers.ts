/**
 * DOM manipulation and styling utilities
 * Combines class name helpers and common UI utilities
 */

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility function for combining class names
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
