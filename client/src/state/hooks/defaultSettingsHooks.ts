import create from "zustand";
// import { persist } from "zustand/middleware";

import {GlobalSettingsState} from "../../utils/interfaces"


interface UseGlobalSettingsAll extends GlobalSettingsState {
  setGlobalSettings: (globalSettings: GlobalSettingsState) => void;
}

export const useGlobalSettings = create<UseGlobalSettingsAll>(
  // persist(
    (set) => ({
      picBackground: false,
      defaultImage: "defaultBackground",
      oneColorForAllCols: false,
      limitColGrowth: false,
      hideNonDeletable: false,
      disableDrag: false,
      numberOfCols: 4,
      date: true,
      description: false,
      itemsPerPage: 7,
      setGlobalSettings: (globalSettings) =>
        set((state) => ({
          ...globalSettings,
        })),
    }),
  //   {
  //     name: "globalSettings-storage",
  //   }
  // )
);




/* interface RssSettingsData {
  date: boolean;
  description: boolean;
  itemsPerPage: number;
}

interface RssSettingsAll extends RssSettingsData {
  setRssSettings: (rssSettings: RssSettingsData) => void;
} */

// moved to useGlobalSettings
/* export const useRssSettings = create<RssSettingsAll>(
  // persist(
    (set) => ({
      date: true,
      description: false,
      itemsPerPage: 7,
      setRssSettings: (rssSettingsData) =>
        set((state) => ({
          ...rssSettingsData,
        })),
    }),
  //   {
  //     name: "rssSettings-storage",
  //   }
  // )
); */
