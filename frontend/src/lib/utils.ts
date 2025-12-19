import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Utility function to merge Tailwind CSS class names
 * Combines clsx and tailwind-merge functionality:
 * - clsx: Conditionally combine class names
 * - twMerge: Intelligently merge Tailwind classes, avoiding conflicts
 * 
 * @param inputs - Array of class names to merge
 * @returns Merged class name string
 * 
 * @example
 * cn('px-2', 'px-4') // Returns 'px-4' (later overrides earlier)
 * cn('bg-red-500', condition && 'bg-blue-500') // Conditional class names
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

