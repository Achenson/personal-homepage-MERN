import create from "zustand";
import { persist } from "zustand/middleware";

interface UseGlobalSettingsData {
  picBackground: boolean;
  defaultImage: string;
  oneColorForAllCols: boolean;
  limitColGrowth: boolean;
  hideNonDeletable: boolean;
  // for better touchscreen experience, dragging and scrolling can clash
  disableDrag: boolean;
  numberOfCols: 1 | 2 | 3 | 4;
}

interface UseGlobalSettingsAll extends UseGlobalSettingsData {
  setGlobalSettings: (globalSettings: UseGlobalSettingsData) => void;
}

export const useGlobalSettings = create<UseGlobalSettingsAll>(
  persist(
    (set) => ({
      picBackground: false,
      defaultImage: "defaultBackground",
      oneColorForAllCols: false,
      limitColGrowth: false,
      hideNonDeletable: false,
      disableDrag: false,
      numberOfCols: 4,
      setGlobalSettings: (globalSettings) =>
        set((state) => ({
          ...globalSettings,
        })),
    }),
    {
      name: "globalSettings-storage",
    }
  )
);

interface RssSettingsData {
  date: boolean;
  description: boolean;
  itemsPerPage: number;
}

interface RssSettingsAll extends RssSettingsData {
  setRssSettings: (rssSettings: RssSettingsData) => void;
}

export const useRssSettings = create<RssSettingsAll>(
  persist(
    (set) => ({
      date: true,
      description: false,
      itemsPerPage: 7,
      setRssSettings: (rssSettingsData) =>
        set((state) => ({
          ...rssSettingsData,
        })),
    }),
    {
      name: "rssSettings-storage",
    }
  )
);
