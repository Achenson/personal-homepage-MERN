import React, { useState, useEffect } from "react";

import shallow from "zustand/shallow";

import Column from "./Column";

import { useBookmarks } from "../../state/hooks/useBookmarks";
import { useGlobalSettings } from "../../state/hooks/defaultSettingsHooks";
import { useResetColors } from "../../state/hooks/colorHooks";
import { useEyeOff } from "../../state/hooks/useEyeOff";
import { useTabs } from "../../state/hooks/useTabs";
import { useUpperUiContext } from "../../context/upperUiContext";

import { useWindowSize } from "../../utils/funcs and hooks/useWindowSize";

interface Props {
  setTabType: React.Dispatch<React.SetStateAction<"folder" | "note" | "rss">>;
}

function Grid({ setTabType }: Props): JSX.Element {
  const tabs = useTabs((store) => store.tabs);
  const tabsLessColumns = useTabs((store) => store.tabsLessColumns);

  const deleteEmptyTab = useTabs((store) => store.deleteEmptyTab);
  const resetAllTabColors = useTabs((store) => store.resetAllTabColors);

  const bookmarksAllTags = useBookmarks((store) => store.bookmarksAllTags);

  const closeAllTabsState = useTabs((store) => store.closeAllTabsState);
  const setCloseAllTabsState = useTabs((store) => store.setCloseAllTabsState);

  const globalSettings = useGlobalSettings((state) => state, shallow);

  const resetColors = useResetColors((state) => state.resetColors);
  const setResetColors = useResetColors((state) => state.setResetColors);

  const setEyeOff = useEyeOff((state) => state.setEyeOff);

  const upperUiContext = useUpperUiContext();

  const windowSize = useWindowSize();

  const [breakpoint, setBreakpoint] = useState<0 | 1 | 2 | 3 | 4 | null>(null);

  useEffect(() => {
    if (windowSize.width) {
      if (windowSize.width >= 1024) {
        setBreakpoint(4);
        return;
      }

      if (windowSize.width >= 768) {
        setBreakpoint(3);
        return;
      }

      if (windowSize.width >= 640) {
        setBreakpoint(2);
        return;
      }

      if (windowSize.width >= 505) {
        setBreakpoint(1);
        return;
      }

      setBreakpoint(0);
    }
  }, [windowSize.width]);

  useEffect(() => {
    if (areTabsInDefaultState()) {
      setEyeOff(false);
    } else {
      setEyeOff(true);
    }

    function areTabsInDefaultState() {
      let isDefault = true;

      tabs.forEach((el) => {
        if (el.opened !== el.openedByDefault) {
          isDefault = false;
          return;
        }
      });

      return isDefault;
    }
  }, [setEyeOff, tabs]);

  useEffect(() => {
    if (
      upperUiContext.upperVisState.colorsBackgroundVis ||
      upperUiContext.upperVisState.colorsColumnVis
    ) {
      setEyeOff(true);
    }
  }, [upperUiContext, setEyeOff]);

  useEffect(() => {
    if (closeAllTabsState) {
      setTimeout(() => {
        setCloseAllTabsState(false);
      }, 500);
    }
  }, [closeAllTabsState, setCloseAllTabsState]);

  useEffect(() => {
    if (resetColors) {
      resetAllTabColors();
      setResetColors(false);
    }
  }, [resetColors, setResetColors, resetAllTabColors]);

  useEffect(() => {
    deleteEmptyTab(bookmarksAllTags);
  }, [tabs, bookmarksAllTags, deleteEmptyTab]);

  useEffect(() => {
    createLessColumns(globalSettings.numberOfCols);

    function createLessColumns(numberOfCols: 1 | 2 | 3 | 4) {
      if (numberOfCols === 4) return;
      tabsLessColumns(numberOfCols);
    }
  }, [globalSettings.numberOfCols, tabsLessColumns]);

  function renderColumns(numberOfCols: 1 | 2 | 3 | 4) {
    let columnProps = {
      setTabType,
      breakpoint,
    };

    switch (numberOfCols) {
      case 1:
        return <Column {...columnProps} colNumber={1} />;
      case 2:
        return (
          <>
            <Column {...columnProps} colNumber={1} />
            <Column {...columnProps} colNumber={2} />
          </>
        );
      case 3:
        return (
          <>
            <Column {...columnProps} colNumber={1} />
            <Column {...columnProps} colNumber={2} />
            <Column {...columnProps} colNumber={3} />
          </>
        );
      case 4:
        return (
          <>
            <Column {...columnProps} colNumber={1} />
            <Column {...columnProps} colNumber={2} />
            <Column {...columnProps} colNumber={3} />
            <Column {...columnProps} colNumber={4} />
          </>
        );
    }
  }

  function gridSettings(
    numberOfCols: 1 | 2 | 3 | 4,
    breakpoint: 0 | 1 | 2 | 3 | 4 | null
  ) {
    if (typeof breakpoint !== "number") {
      return;
    }
    // lowest possible so sm version of UpperRightMenu still don't crash with left side
    const maxColWidth = `${globalSettings.limitColGrowth ? "350px" : "9999px"}`;

    switch (numberOfCols) {
      case 1:
        return `repeat(1, minmax(0, ${maxColWidth}))`;

      case 2:
        if (breakpoint >= 2) {
          return `repeat(2, minmax(0, ${maxColWidth}))`;
        }
        return `repeat(1, minmax(0, ${maxColWidth}))`;

      case 3:
        if (breakpoint >= 3) {
          return `repeat(3, minmax(0, ${maxColWidth}))`;
        }

        if (breakpoint >= 2) {
          return `repeat(${breakpoint}, minmax(0, ${maxColWidth}))`;
        }

        return `repeat(1, minmax(0, ${maxColWidth}))`;

      case 4:
        if (breakpoint >= 4) {
          return `repeat(4, minmax(0, ${maxColWidth}))`;
        }

        if (breakpoint >= 3) {
          return `repeat(3, minmax(0, ${maxColWidth}))`;
        }

        if (breakpoint >= 2) {
          return `repeat(2, minmax(0, ${maxColWidth}))`;
        }

        return `repeat(1, minmax(0, ${maxColWidth}))`;
    }
  }

  return (
    <div className="mx-2 xs:mx-4">
      <div
        className={`grid justify-center gap-x-2 gap-y-6`}
        style={{
          // gridTemplateColumns: "repeat(1, minmax(0, 800px))"
          gridTemplateColumns: `${gridSettings(
            globalSettings.numberOfCols,
            breakpoint
          )}`,
        }}
      >
        {typeof breakpoint === "number" &&
          renderColumns(globalSettings.numberOfCols)}
      </div>
      <div className="h-72"></div>
    </div>
  );
}

export default Grid;
