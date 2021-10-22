import React, { useState, useEffect } from "react";
import { useMutation } from "urql";

// import shallow from "zustand/shallow";

import Column from "./Column";

// import { useBookmarks } from "../../state/hooks/useBookmarks";
// import { useGlobalSettings } from "../../state/hooks/defaultSettingsHooks";
import { useResetColors } from "../../state/hooks/colorHooks";
import { useReset } from "../../state/hooks/useReset";
import { useTabs } from "../../state/hooks/useTabs";
import { useUpperUiContext } from "../../context/upperUiContext";

import { useWindowSize } from "../../utils/funcs and hooks/useWindowSize";
import {
  DeleteTabMutation,
  ChangeTabMutation,
} from "../../graphql/graphqlMutations";

import { SettingsDatabase_i } from "../../../../schema/types/settingsType";
import { TabDatabase_i } from "../../../../schema/types/tabType";
import { SingleBookmarkData, SingleTabData } from "../../utils/interfaces";

interface TabId {
  id: string;
}

interface Props {
  setTabType: React.Dispatch<React.SetStateAction<"folder" | "note" | "rss">>;
  globalSettings: SettingsDatabase_i;
  bookmarks: SingleBookmarkData[];
  // tabs: SingleTabData[];
  tabs: TabDatabase_i[];
}

function Grid({
  setTabType,
  globalSettings,
  bookmarks,
  tabs,
}: Props): JSX.Element {
  // const tabs = useTabs((store) => store.tabs);
  const tabsLessColumns = useTabs((store) => store.tabsLessColumns);

  const tabDeletingPause = useTabs((store) => store.tabDeletingPause);

  // const deleteEmptyTab = useTabs((store) => store.deleteEmptyTab);
  const [deleteTabResult, deleteTab] = useMutation<any, TabId>(
    DeleteTabMutation
  );

  const [editTabResult, editTab] = useMutation<any, TabDatabase_i>(
    ChangeTabMutation
  );

  // const resetAllTabColors = useTabs((store) => store.resetAllTabColors);

  // const bookmarksAllTags = useBookmarks((store) => store.bookmarksAllTags);

  const closeAllTabsState = useTabs((store) => store.closeAllTabsState);
  const setCloseAllTabsState = useTabs((store) => store.setCloseAllTabsState);

  // const globalSettings = useGlobalSettings((state) => state, shallow);

  const resetColors = useResetColors((state) => state.resetColors);
  const setResetColors = useResetColors((state) => state.setResetColors);

  const setReset = useReset((state) => state.setReset);

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
      setReset(false);
    } else {
      setReset(true);
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
  }, [setReset, tabs]);

  useEffect(() => {
    if (
      upperUiContext.upperVisState.colorsBackgroundVis ||
      upperUiContext.upperVisState.colorsColumnVis
    ) {
      setReset(true);
    }
  }, [upperUiContext, setReset]);

  useEffect(() => {
    if (closeAllTabsState) {
      tabs.forEach((obj) => {
        editTab({ ...obj, opened: obj.openedByDefault });
      });

      setTimeout(() => {
        setCloseAllTabsState(false);
      }, 500);
    }
  }, [closeAllTabsState, setCloseAllTabsState]);

  /*   useEffect(() => {
    if (resetColors) {
      resetAllTabColors();
      setResetColors(false);
    }
  }, [resetColors, setResetColors, resetAllTabColors]); */

  useEffect(() => {
    if (resetColors) {
      tabs.forEach((obj) => {
        editTab({ ...obj, color: null });
      });
      setResetColors(false);
    }
  }, [resetColors, setResetColors]);

  /* useEffect(() => {
    deleteEmptyTab(bookmarksAllTags);
  }, [tabs, bookmarksAllTags, deleteEmptyTab]); */

  /*   useEffect(() => {
    console.log(bookmarksAllTags);
    tabs
      .filter((obj) => obj.type === "folder")
      .forEach((obj) => {
        if (!bookmarksAllTags.includes(obj.id)) {
          // deleteTab({ id: obj.id });
          console.log(obj.id);
        }
      });
  }, [tabs, bookmarksAllTags]); */

  useEffect(() => {

    if(tabDeletingPause) {
      return;
    }

    let bookmarksAllTags: string[] = [];

    bookmarks.forEach((obj) => {
      obj.tags.forEach((el) => {
        if (!bookmarksAllTags.includes(el)) {
          bookmarksAllTags.push(el);
        }
      });
    });

    console.log(bookmarksAllTags);

    tabs
      .filter((obj) => obj.type === "folder")
      .forEach((obj) => {
        if (!bookmarksAllTags.includes(obj.id) && !tabDeletingPause) {
          deleteTab({ id: obj.id });
          // console.log(obj.id);
        }
      });
  }, [bookmarks, tabs, tabDeletingPause]);

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
      tabs,
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
