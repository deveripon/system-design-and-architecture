import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const BENGALI_DIGITS = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];

/** Render a number with Bengali numerals, to match the course copy. */
export function toBn(value: number | string) {
    return String(value).replace(/\d/g, d => BENGALI_DIGITS[Number(d)]);
}
