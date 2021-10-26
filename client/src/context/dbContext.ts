import React from "react";

import { DbContext_i } from "../utils/interfaces";

// undefined, so it can be initialised with no specific value
export const DbContext = React.createContext<DbContext_i | undefined>(
  undefined
);

// use in place of useContext in children (because Typescript)
export function useDbContext() {
  const context = React.useContext(DbContext);

  if (context === undefined) {
    throw new Error(
      "useUpperUiContext must be used within a UpperUiContext.Provider"
    );
  }

  return context;
}
