import React from "react";

import { BackgroundImgContext_i } from "../utils/interfaces";

// undefined, so it can be initialised with no specific value
export const BackgroundImgContext = React.createContext<
  BackgroundImgContext_i | undefined
>(undefined);

// use in place of useContext in children (because Typescript)
export function useBackgroundImgContext() {
  const context = React.useContext(BackgroundImgContext);

  if (context === undefined) {
    throw new Error(
      "useBackgroundImgContext must be used within a BackgroundImgContext.Provider"
    );
  }

  return context;
}
