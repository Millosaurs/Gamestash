import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Simple in-memory cache utility
export function createCache<T>(ttlMs: number = 60000) {
  let cache: { key: string; value: T; expires: number } | null = null;
  return {
    get(key: string): T | null {
      if (cache && cache.key === key && cache.expires > Date.now()) {
        return cache.value;
      }
      return null;
    },
    set(key: string, value: T) {
      cache = { key, value, expires: Date.now() + ttlMs };
    },
    clear() {
      cache = null;
    },
  };
}
