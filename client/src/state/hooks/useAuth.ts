import create from "zustand";
import { LoginMutation } from "../../graphql/graphqlMutations";

import { AuthContextZustand_i } from "../../utils/interfaces";

export const useAuth = create<AuthContextZustand_i>((set) => ({
  isAuthenticated: false,
  authenticatedUserId: null,
  accessToken: null,
  loginNotification: null,
  loginErrorMessage: null,
  // loginNotification arg -> setting message after deleting user
  logout: (loginNotification) =>
    set((state) => ({
      ...state,
      isAuthenticated: false,
      authenticatedUserId: null,
      accessToken: null,
      loginNotification: loginNotification,
    })),
  loginAttempt: (isAuthenticated, userId, token) =>
    set((state) => ({
      ...state,
      isAuthenticated: isAuthenticated,
      authenticatedUserId: userId,
      accessToken: token,
    })),

  setLoginNotification: (loginNotification) =>
    set((state) => ({
      ...state,
      loginNotification: loginNotification,
    })),

  //   setLoggedInState: (trueOrFalse) =>
  //     set((state) => ({
  //       ...state,
  //       loggedInState: trueOrFalse,
  //     })),
}));
