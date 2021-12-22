import React from "react";

import { AuthContext_i } from "../utils/interfaces";

// undefined, so it can be initialised with no specific value
export const AuthContext = React.createContext<AuthContext_i | undefined>(
  undefined
);

// use in place of useContext in children (because Typescript)
export function useAuthContext() {
  const context = React.useContext(AuthContext);

  if (context === undefined) {
    throw new Error(
      "useAuthContext must be used within a AuthContext.Provider"
    );
  }

  return context;
}
