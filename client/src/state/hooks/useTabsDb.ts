import create from "zustand";
import { TabDatabase_i } from "../../../../schema/types/tabType";
// import { tabsDbInit } from "../../../../schema/data/defaultTabs";
import { SingleBookmarkDataBasic } from "../../utils/interfaces";

import {tabsDataDbInit} from "../../state/data/tabsData"



interface UseTabsDb {
  tabsDb: TabDatabase_i[];
  updateTabsDb: (newTabsDb: TabDatabase_i[]) => void;
}

export const useTabsDb = create<UseTabsDb>((set) => ({
  tabsDb: [...tabsDataDbInit],
  updateTabsDb: (newTabsDb) =>
    set((state) => ({
      ...state,
      tabsDb: [...newTabsDb],
    })),
}));
