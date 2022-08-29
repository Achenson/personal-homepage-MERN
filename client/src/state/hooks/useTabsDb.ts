import create from "zustand";
import { TabDatabase_i } from "../../../../schema/types/tabType";

interface UseTabsDb {
  tabsDb: TabDatabase_i[] | null;
  updateTabsDb: (newTabsDb: TabDatabase_i[]) => void;
}

export const useTabsDb = create<UseTabsDb>((set) => ({
  tabsDb: null,
  updateTabsDb: (newTabsDb) =>
    set((state) => ({
      ...state,
      tabsDb: [...newTabsDb],
    })),
}));
