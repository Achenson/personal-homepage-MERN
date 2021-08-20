import create from "zustand";

export const useEyeOff = create<{
  enabled: boolean;
  setEyeOff: (trueOrFalse: boolean) => void;
}>((set) => ({
  enabled: false,
  // enabled: true,
  setEyeOff: (trueOrFalse) =>
    set((state) => ({
      ...state,
      enabled: trueOrFalse,
    })),
}));
