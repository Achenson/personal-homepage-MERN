import create from "zustand";
// use for reseting tabs to default open/closed state
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
