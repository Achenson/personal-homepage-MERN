import { useState } from "react";
import { createContainer } from "react-tracked";

import { AuthContextObj_i } from "../utils/interfaces";


const useValue = () =>
  useState<AuthContextObj_i>({
    isAuthenticated: false,
    authenticatedUserId: null,
    accessToken: null,
    loginNotification: null,
    loginErrorMessage: null,
  });

// export const { Provider, useTracked } = createContainer(useValue, { concurrentMode: true });
export const { Provider: AuthProvider, useTracked: useTrackedAuth } = createContainer(useValue);
