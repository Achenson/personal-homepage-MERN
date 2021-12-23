import React, { useState } from "react";

import App from "./App";

import { AuthContext } from "./context/authContext";

import { AuthContextObj_i } from "./utils/interfaces";

/* interface Props {
  globalSettings: SettingsDatabase_i;
} */

function AppWrapper({}): JSX.Element {
  const [authContext, setAuthContext] = useState<AuthContextObj_i>({
    isAuthenticated: false,
    authenticatedUserId: null,
    accessToken: null,
    loginNotification: null,
    loginErrorMessage: null,
  });

  let authValue = {
    isAuthenticated: authContext.isAuthenticated,
    authenticatedUserId: authContext.authenticatedUserId,
    accessToken: authContext.accessToken,
    loginNotification: authContext.loginNotification,
    loginErrorMessage: authContext.loginErrorMessage,
    updateAuthContext: setAuthContext,
  };

  return (
    <AuthContext.Provider value={authValue}>
      <App />
    </AuthContext.Provider>
  );
}

export default AppWrapper;