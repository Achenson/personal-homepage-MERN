import create from "zustand";

export const useReset = create<{
  enabled: boolean;
  setReset: (trueOrFalse: boolean) => void;
}>((set) => ({
  enabled: false,
  // enabled: true,
  setReset: (trueOrFalse) =>
    set((state) => ({
      ...state,
      enabled: trueOrFalse,
    })),
}));
