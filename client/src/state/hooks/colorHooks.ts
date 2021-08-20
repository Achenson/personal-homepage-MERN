import create from "zustand";
import { persist } from "zustand/middleware";

import {
  columnColors,
  imageColumnColors,
} from "../../utils/data/colors_column";
import { backgroundColors } from "../../utils/data/colors_background";
import { tabColors } from "../../utils/data/colors_tab";

interface DefaultColorsData {
  folderColor: string;
  noteColor: string;
  rssColor: string;
  uiColor: string;
}

interface DefaultColorObj {
  key: "folderColor" | "noteColor" | "rssColor" | "uiColor";
  color: string;
}

interface DefaultColorsAll extends DefaultColorsData {
  setDefaultColors: (defaultColorObj: DefaultColorObj) => void;
}

interface ColumnsColorsObj {
  key: "column_1" | "column_2" | "column_3" | "column_4";
  color: string;
}

interface UseColumnsColorsData {
  column_1: string;
  column_2: string;
  column_3: string;
  column_4: string;
}

interface UseColumnsColorsAll extends UseColumnsColorsData {
  setColumsColors: (columnsColorsObj: ColumnsColorsObj) => void;
}

export const useDefaultColors = create<DefaultColorsAll>(
  persist(
    (set) => ({
      folderColor: tabColors[7][2],
      noteColor: tabColors[1][2],
      rssColor: tabColors[9][2],
      uiColor: tabColors[7][2],
      setDefaultColors: (defaultColorObj) =>
        set((state) => ({
          ...state,
          [defaultColorObj.key]: defaultColorObj.color,
        })),
    }),
    {
      name: "defaultColors-storage",
    }
  )
);

export const useBackgroundColor = create<{
  backgroundColor: string;
  setBackgroundColor: (backgroundColor: string) => void;
}>(
  persist(
    (set) => ({
      backgroundColor: backgroundColors[0][1],
      setBackgroundColor: (backgroundColor) =>
        set((state) => ({
          ...state,
          backgroundColor: backgroundColor,
        })),
    }),
    {
      name: "backgroundColor-storage",
    }
  )
);

export const useResetColors = create<{
  resetColors: boolean;
  setResetColors: (trueOrFalse: boolean) => void;
}>((set) => ({
  resetColors: false,
  setResetColors: (trueOrFalse) =>
    set((state) => ({
      ...state,
      resetColors: trueOrFalse,
    })),
}));

export const useColumnsColors = create<UseColumnsColorsAll>(
  persist(
    (set) => ({
      column_1: columnColors[0][8],
      column_2: columnColors[1][5],
      column_3: columnColors[1][8],
      column_4: columnColors[3][2],
      setColumsColors: (columnColorsObj) =>
        set((state) => ({
          ...state,
          [columnColorsObj.key]: columnColorsObj.color,
        })),
    }),
    {
      name: "columnsColors-storage",
    }
  )
);

export const useColumnsColorsImg = create<UseColumnsColorsAll>(
  persist(
    (set) => ({
      column_1: imageColumnColors[2][6],
      column_2: imageColumnColors[2][6],
      column_3: imageColumnColors[3][5],
      column_4: imageColumnColors[0][5],
      setColumsColors: (columnColorsObj) =>
        set((state) => ({
          ...state,
          [columnColorsObj.key]: columnColorsObj.color,
        })),
    }),
    {
      name: "columnsColorsImg-storage",
    }
  )
);

export const useTabBeingDraggedColor = create<{
  tabBeingDraggedColor: string;
  setTabBeingDraggedColor: (color: string) => void;
}>((set) => ({
  tabBeingDraggedColor: "",
  setTabBeingDraggedColor: (color) =>
    set((state) => ({
      ...state,
      tabBeingDraggedColor: color,
    })),
}));
