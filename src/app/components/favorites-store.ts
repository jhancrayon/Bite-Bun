import { useSyncExternalStore } from "react";

/** Dishes the user starts out having hearted. */
const INITIAL = ["m-bg1", "m-pz1", "m-ps1"];

let favorites: string[] = INITIAL;
const listeners = new Set<() => void>();

const emit = () => listeners.forEach((listener) => listener());

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

export function toggleFavorite(id: string) {
  favorites = favorites.includes(id) ? favorites.filter((entry) => entry !== id) : [...favorites, id];
  emit();
}

export function removeFavorite(id: string) {
  favorites = favorites.filter((entry) => entry !== id);
  emit();
}

/**
 * Favourite dish ids. Lives in a module-level store so any part of the page can
 * read or update the list without needing a provider around it.
 */
export function useFavorites() {
  return useSyncExternalStore(
    subscribe,
    () => favorites,
    () => favorites,
  );
}
