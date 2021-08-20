import create from "zustand";

export const useLoggedInState = create<{
  loggedInState: boolean;
  setLoggedInState: (trueOrFalse: boolean) => void;
}>((set) => ({
  loggedInState: false,
  setLoggedInState: (trueOrFalse) =>
    set((state) => ({
      ...state,
      loggedInState: trueOrFalse,
    })),
}));
