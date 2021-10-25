import React from "react";

import { BookmarksDbContext_i } from "../utils/interfaces";

// undefined, so it can be initialised with no specific value
export const BookmarksDbContext = React.createContext<BookmarksDbContext_i | undefined>(
  undefined
);

// use in place of useContext in children (because Typescript)
export function useBookmarksDbContext() {
  const context = React.useContext(BookmarksDbContext);

  if (context === undefined) {
    throw new Error(
      "useUpperUiContext must be used within a UpperUiContext.Provider"
    );
  }

  return context;
}
