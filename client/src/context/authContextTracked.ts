import { useState, useReducer, Reducer } from "react";
import { createContainer } from "react-tracked";

import { AuthContextObj_i } from "../utils/interfaces";

const initialState: AuthContextObj_i = {
  isAuthenticated: false,
  authenticatedUserId: null,
  accessToken: null,
  loginNotification: null,
  loginErrorMessage: null,
};

type State = typeof initialState;

type Action =
  | { type: "logout" }
  | {
      type: "loginAttempt";
      isAuthenticated: boolean;
      userId: string;
      token: string;
    };

const reducer: Reducer<State, Action> = (state, action) => {
  switch (action.type) {
    case "logout":
      return {
        ...state,
        isAuthenticated: false,
        authenticatedUserId: null,
        accessToken: null,
      };
    case "loginAttempt":
      return {
        ...state,
        isAuthenticated: action.isAuthenticated,
        authenticatedUserId: action.userId,
        accessToken: action.token,
      };

    default:
      throw new Error("unknown action type");
  }
};

/* const useValue = () =>
  useState<AuthContextObj_i>({
    isAuthenticated: false,
    authenticatedUserId: null,
    accessToken: null,
    loginNotification: null,
    loginErrorMessage: null,
  }); */

const useValue = () => useReducer(reducer, initialState);
// export const { Provider, useTracked } = createContainer(useValue, { concurrentMode: true });
export const { Provider: AuthProvider, useTracked: useTrackedAuth } =
  createContainer(useValue, { concurrentMode: true });
