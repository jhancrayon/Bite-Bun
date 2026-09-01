import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

export type Category = "all" | "combo" | "burger" | "pizza" | "pasta" | "chicken" | "salad" | "healthy" | "dessert" | "drink";

type FilterValue = {
  category: Category;
  setCategory: (c: Category) => void;
  menuOpen: boolean;
  /** Search text shared between the hero search box and the menu overlay. */
  query: string;
  setQuery: (q: string) => void;
  openMenu: (c?: Category, q?: string) => void;
  closeMenu: () => void;
};

const FilterContext = createContext<FilterValue | null>(null);

export function MenuFilterProvider({ children }: { children: ReactNode }) {
  const [category, setCategory] = useState<Category>("all");
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState("");

  const value = useMemo<FilterValue>(
    () => ({
      category,
      setCategory,
      menuOpen,
      query,
      setQuery,
      openMenu: (c, q) => {
        if (c) setCategory(c);
        if (q !== undefined) setQuery(q);
        setMenuOpen(true);
      },
      closeMenu: () => setMenuOpen(false),
    }),
    [category, menuOpen, query],
  );

  return <FilterContext.Provider value={value}>{children}</FilterContext.Provider>;
}

export function useMenuFilter() {
  const ctx = useContext(FilterContext);
  if (!ctx) throw new Error("useMenuFilter must be used inside <MenuFilterProvider>");
  return ctx;
}
