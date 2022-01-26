import create from "zustand";

import { AuthContextZustand_i } from "../../utils/interfaces";

export const useAuth = create<AuthContextZustand_i>((set) => ({
  isAuthenticated: false,
  authenticatedUserId: null,
  accessToken: null,
  loginNotification: null,
  loginErrorMessage: null,
  logout: () => set(state => ({
      ...state,
      isAuthenticated: false,
      authenticatedUserId: null,
      accessToken: null
  })),
  loginAttempt: (isAuthenticated, userId, token) => set(state => ({
      ...state,
      isAuthenticated: isAuthenticated,
      authenticatedUserId: userId,
      accessToken: token
  }))

//   setLoggedInState: (trueOrFalse) =>
//     set((state) => ({
//       ...state,
//       loggedInState: trueOrFalse,
//     })),



}));
