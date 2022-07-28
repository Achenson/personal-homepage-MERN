import React, { useState, useEffect } from "react";
import { useMutation } from "urql";

// import shallow from "zustand/shallow";

import Column from "./Column";

// import { useBookmarks } from "../../state/hooks/useBookmarks";
// import { useGlobalSettings } from "../../state/hooks/defaultSettingsHooks";
import { useResetColors } from "../../state/hooks/colorHooks";
import { useReset } from "../../state/hooks/useReset";
import { useBookmarks } from "../../state/hooks/useBookmarks";
import { useTabs } from "../../state/hooks/useTabs";
import { useUpperUiContext } from "../../context/upperUiContext";
import { useDbContext } from "../../context/dbContext";

import { useWindowSize } from "../../utils/funcs and hooks/useWindowSize";
import {
  DeleteTabMutation,
  ChangeTabMutation,
} from "../../graphql/graphqlMutations";

import { SettingsDatabase_i } from "../../../../schema/types/settingsType";
import { BookmarkDatabase_i } from "../../../../schema/types/bookmarkType";
import { TabDatabase_i } from "../../../../schema/types/tabType";
import { SingleBookmarkData, SingleTabData } from "../../utils/interfaces";

interface TabId {
  id: string;
}

interface Props {
  setTabType: React.Dispatch<React.SetStateAction<"folder" | "note" | "rss">>;
  globalSettings: SettingsDatabase_i;
  userIdOrNoId: string | null;
  // bookmarks: SingleBookmarkData[];
  // tabs: SingleTabData[];
  // tabs: TabDatabase_i[];
  // staleBookmarks: boolean;
}

function Grid({
  setTabType,
  globalSettings,
  userIdOrNoId,
}: // bookmarks,
// tabs,
// staleBookmarks,
Props): JSX.Element {
  // const tabs = useTabs((store) => store.tabs);
  const tabIdsUsedByBookmarks = useBookmarks((store) => store.tabIdsUsedByBookmarks);
  const tabsLessColumns = useTabs((store) => store.tabsLessColumns);

  const tabsNotAuth = useTabs((store) => store.tabs);
  const bookmarksNotAuth = useBookmarks((store) => store.bookmarks);

  const setTabDeletingPause = useTabs((store) => store.setTabDeletingPause);
  const tabDeletingPause = useTabs((store) => store.tabDeletingPause);

  let bookmarks: BookmarkDatabase_i[] | SingleBookmarkData[];
  let tabs: TabDatabase_i[] | SingleTabData[];

  const bookmarksDb = useDbContext()?.bookmarks;
  // only used in authenticated version of the app
  const staleBookmarks = useDbContext()?.stale_bookmarks;
  const tabsDb = useDbContext()?.tabs;
  // const reexecuteBookmarks = useDbContext().reexecuteBookmarks;

  bookmarks = userIdOrNoId
    ? (bookmarksDb as SingleBookmarkData[])
    : bookmarksNotAuth;
  tabs = userIdOrNoId ? (tabsDb as TabDatabase_i[]) : tabsNotAuth;

  const [deleteTabResult, deleteTab] = useMutation<any, TabId>(
    DeleteTabMutation
  );

  const [editTabResult, editTab] = useMutation<any, TabDatabase_i>(
    ChangeTabMutation
  );

  // const resetAllTabColors = useTabs((store) => store.resetAllTabColors);

  // const tabIdsUsedByBookmarks = useBookmarks((store) => store.tabIdsUsedByBookmarks);

  const closeAllTabsState = useTabs((store) => store.closeAllTabsState);
  const setCloseAllTabsState = useTabs((store) => store.setCloseAllTabsState);
  const resetAllTabColors = useTabs((store) => store.resetAllTabColors);
  const deleteEmptyTabsNotAuth = useTabs((store) => store.deleteEmptyTab);

  // const globalSettings = useGlobalSettings((state) => state, shallow);

  const resetColors = useResetColors((store) => store.resetColors);
  const setResetColors = useResetColors((store) => store.setResetColors);

  const setReset = useReset((store) => store.setReset);

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
      if (userIdOrNoId) {
        (tabs as TabDatabase_i[]).forEach((obj) => {
          editTab({ ...obj, opened: obj.openedByDefault });
        });
      }

      setTimeout(() => {
        setCloseAllTabsState(false);
      }, 500);
    }
  }, [closeAllTabsState, setCloseAllTabsState, userIdOrNoId]);

  /*   useEffect(() => {
    if (resetColors) {
      resetAllTabColors();
      setResetColors(false);
    }
  }, [resetColors, setResetColors, resetAllTabColors]); */

  useEffect(() => {
    if (resetColors) {
      userIdOrNoId
        ? (tabs as TabDatabase_i[]).forEach((obj) => {
            editTab({ ...obj, color: null });
          })
        : resetAllTabColors();

      setResetColors(false);
    }
  }, [resetColors, setResetColors, userIdOrNoId]);

  /* useEffect(() => {
    deleteEmptyTab(tabIdsUsedByBookmarks);
  }, [tabs, tabIdsUsedByBookmarks, deleteEmptyTab]); */

  /*   useEffect(() => {
    console.log(tabIdsUsedByBookmarks);
    tabs
      .filter((obj) => obj.type === "folder")
      .forEach((obj) => {
        if (!tabIdsUsedByBookmarks.includes(obj.id)) {
          // deleteTab({ id: obj.id });
          console.log(obj.id);
        }
      });
  }, [tabs, tabIdsUsedByBookmarks]); */

  useEffect(() => {
    if (!userIdOrNoId) {
      deleteEmptyTabsNotAuth(tabIdsUsedByBookmarks);
      return;
    }

    deleteEmptyTabs();
    async function deleteEmptyTabs() {
      // console.log(tabDeletingPause);

      if (tabDeletingPause) {
        return;
      }

      if (staleBookmarks) {
        return;
      }

      let tabIdsUsedByBookmarks: string[] = [];

      bookmarks.forEach((obj) => {
        obj.tags.forEach((el) => {
          if (!tabIdsUsedByBookmarks.includes(el)) {
            tabIdsUsedByBookmarks.push(el);
          }
        });
      });

      // console.log(tabIdsUsedByBookmarks);

      if (userIdOrNoId) {
        tabs
          .filter((obj) => obj.type === "folder" && obj.deletable)
          .forEach((obj) => {
            if (!tabIdsUsedByBookmarks.includes(obj.id) && !tabDeletingPause) {
              deleteTab({ id: obj.id }).then((result) => {
                if (result.error) {
                  console.log(result.error);
                  return;
                }
              });
            }
          });
      } else {
        deleteEmptyTabsNotAuth(tabIdsUsedByBookmarks);
      }

      // let arrOfPromises: Promise<string>[] = [];

      /*     tabs
        .filter((obj) => obj.type === "folder")
        .forEach((obj) => {
          let newPromise = new Promise<string>((resolve, reject) => {
            if (!tabIdsUsedByBookmarks.includes(obj.id) && !tabDeletingPause) {
              deleteTab({ id: obj.id }).then((result) => {
                if (result.error) {
                  reject(result.error);
                  return;
                }
                resolve(result.data.deleteTab.id);
              });
              // console.log(obj.id);
            } else {
              resolve("no ID");
            }
          });

          arrOfPromises.push(newPromise);
        }); */

      // let allPromises = "test"

      // await Promise.all(arrOfPromises);

      // console.log("sth");

      setTabDeletingPause(true);

      /*  tabs
        .filter((obj) => obj.type === "folder")
        .forEach((obj) => {
          if (!tabIdsUsedByBookmarks.includes(obj.id) && !tabDeletingPause) {
            deleteTab({ id: obj.id });
            // console.log(obj.id);
          }
        }); */
    }
    // }, [bookmarks, tabs, tabDeletingPause, userIdOrNoId]);
  }, [
    bookmarks,
    tabs,
    tabDeletingPause,
    userIdOrNoId,
    tabIdsUsedByBookmarks,
    deleteEmptyTabsNotAuth,
  ]);

  // client-side legacy code, now handled by GlobalSettings
  /*   useEffect(() => {
    createLessColumns(globalSettings.numberOfCols);

    function createLessColumns(numberOfCols: 1 | 2 | 3 | 4) {
      if (numberOfCols === 4) return;
      tabsLessColumns(numberOfCols);
    }
  }, [globalSettings.numberOfCols, tabsLessColumns]); */

  function renderColumns(numberOfCols: 1 | 2 | 3 | 4) {
    let columnProps = {
      setTabType,
      breakpoint,
      tabs,
      userIdOrNoId,
      globalSettingsDb: globalSettings
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
