import React, { useContext, useEffect, useState } from "react";

import FocusLock from "react-focus-lock";
// import shallow from "zustand/shallow";
import { useMutation } from "urql";

import Settings_inner_xs from "./Settings_inner_xs";

import { ReactComponent as CancelSVG } from "../../svgs/alphabet-x.svg";

// import { useDefaultColors } from "../../state/hooks/colorHooks";
// import { useRssSettings } from "../../state/hooks/defaultSettingsHooks";
import { useGlobalSettings } from "../../state/hooks/defaultSettingsHooks";

import { useTabs } from "../../state/hooks/useTabs";
import { useUpperUiContext } from "../../context/upperUiContext";
import { useDbContext } from "../../context/dbContext";

import { useWindowSize } from "../../utils/funcs and hooks/useWindowSize";
import { handleKeyDown_upperUiSetting } from "../../utils/funcs and hooks/handleKeyDown_upperUiSettings";
import {
  ChangeSettingsMutation,
  ChangeTabMutation,
} from "../../graphql/graphqlMutations";

import { SettingsDatabase_i } from "../../../../schema/types/settingsType";
import { TabDatabase_i } from "../../../../schema/types/tabType";
import { objectTraps } from "immer/dist/internal";

import { SingleTabData } from "../../utils/interfaces";

interface Props {
  mainPaddingRight: boolean;
  scrollbarWidth: number;
  globalSettings: SettingsDatabase_i;
  userIdOrNoId: string | null;
}

function GlobalSettings({
  mainPaddingRight,
  scrollbarWidth,
  globalSettings,
  userIdOrNoId,
}: Props): JSX.Element {
  // const uiColor = useDefaultColors((state) => state.uiColor);
  const uiColor = globalSettings.uiColor;

  // shallow option enables updates when any of the object keys changes!
  // const globalSettings = useGlobalSettings((state) => state, shallow);
  const setGlobalSettings = useGlobalSettings(
    (store) => store.setGlobalSettings
  );

  // const tabs = useDbContext().tabs;

  const tabsNotAuth = useTabs((store) => store.tabs);

  const tabsDb = useDbContext()?.tabs;

  let tabs: TabDatabase_i[] | SingleTabData[];

  tabs = userIdOrNoId ? (tabsDb as TabDatabase_i[]) : tabsNotAuth;

  const setTabOpenedState = useTabs((store) => store.setTabOpenedState);

  /*  const rssSettingsState = useRssSettings((state) => state, shallow);
  const setRssSettingsState = useRssSettings((state) => state.setRssSettings); */

  const upperUiContext = useUpperUiContext();

  const windowSize = useWindowSize();
  const [xsScreen, setXsScreen] = useState(
    () => upperUiContext.upperVisState.xsSizing_initial
  );

  useEffect(() => {
    if (windowSize.width) {
      if (windowSize.width < 505) {
        setXsScreen(true);
      } else {
        setXsScreen(false);
      }
    }
  }, [windowSize.width]);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  });

  /* const [settingsResults] = useQuery({
    query: SettingsQuery,
    variables: { userId: testUserId },
  }); */

  const [changeSettingsResult, changeSettings] = useMutation<
    any,
    SettingsDatabase_i
  >(ChangeSettingsMutation);

  const [editTabResult, editTab] = useMutation<any, TabDatabase_i>(
    ChangeTabMutation
  );

  /*  const { data, fetching, error } = settingsResults;

  if (fetching) return <p>Loading...</p>;
  if (error) return <p>Oh no... {error.message}</p>;

  let globalSettings: SettingsDatabase_i = data.settings; */

  function handleKeyDown(event: KeyboardEvent) {
    handleKeyDown_upperUiSetting(event.code, upperUiContext, 7);
  }

  function renderColsNumberControls() {
    const arrOfColsNumbers: (1 | 2 | 3 | 4)[] = [1, 2, 3, 4];

    let colsNumbering = {
      1: "one",
      2: "two",
      3: "three",
      4: "four",
    };

    return arrOfColsNumbers.map((el, i) => {
      return (
        <div className="flex items-center ml-2" key={i}>
          <button
            onClick={() => {
              if (!userIdOrNoId) {
                setGlobalSettings({
                  ...globalSettings,
                  numberOfCols: el,
                });

                return;
              }

              changeSettings({ ...globalSettings, numberOfCols: el });

              (tabs as TabDatabase_i[])
                // .filter((obj) => obj.column >= globalSettings.numberOfCols)
                .filter((obj) => obj.column >= el)
                .sort((a, b) => {
                  if (a.title < b.title) {
                    return -1;
                  }
                  if (a.title > b.title) {
                    return 1;
                  }
                  return 0;
                })
                .forEach((obj, i) => {
                  editTab({ ...obj, column: el, priority: i });
                  /* obj.column = globalSettings.numberOfCols;
                  obj.priority = i; */
                });
            }}
            className="focus-1-offset"
          >
            <p
              className={` ${
                globalSettings.numberOfCols === el
                  ? `text-${uiColor} underline cursor-default`
                  : `text-black cursor-pointer hover:text-${uiColor} hover:text-opacity-70`
              } 
              `}
            >
              {colsNumbering[el]}
            </p>
          </button>
        </div>
      );
    });
  }
  return (
    <FocusLock>
      <div
        className={`flex flex-col z-50 fixed h-full w-screen justify-center items-center `}
        style={{ backgroundColor: "rgba(90, 90, 90, 0.4)" }}
        onClick={() => {
          upperUiContext.upperVisDispatch({ type: "SETTINGS_TOGGLE" });
        }}
      >
        <div
          className="md:mb-40 relative"
          onClick={(e) => {
            e.stopPropagation();
            return;
          }}
        >
          <div
            className={`bg-gray-100 pb-3 pt-5 border-2 px-4 border-${uiColor} rounded-sm relative`}
            style={{
              width: `${xsScreen ? "350px" : "417px"}`,
              height: "287px",
              marginLeft: `${
                mainPaddingRight && scrollbarWidth >= 10
                  ? `-${scrollbarWidth - 1}px`
                  : ""
              }`,
            }}
          >
            <Settings_inner_xs
              currentSettings="global"
              globalSettings={globalSettings}
            />

            <div className="absolute right-0 top-0 mt-1 mr-1">
              <button
                className="h-5 w-5 focus-2-offset-dark"
                onClick={() => {
                  upperUiContext.upperVisDispatch({ type: "SETTINGS_TOGGLE" });
                  upperUiContext.upperVisDispatch({
                    type: "FOCUS_ON_UPPER_RIGHT_UI",
                    payload: 7,
                  });
                }}
                aria-label={"Close"}
              >
                <CancelSVG className="h-full w-full fill-current text-gray-600 cursor-pointer hover:text-gray-900" />
              </button>
            </div>

            <p className="text-center">Global settings</p>
            <div className="flex justify-between items-center mb-2 mt-2">
              <p className="">One color for all columns</p>
              <button
                className={`h-4 w-4 cursor-pointer transition duration-75 border-2 border-${uiColor} ${
                  globalSettings.oneColorForAllCols
                    ? `bg-${uiColor} bg-opacity-50 hover:border-opacity-30`
                    : `hover:border-opacity-50`
                } focus-1-offset-dark`}
                onClick={() => {
                  /*   setGlobalSettings({
                    ...globalSettings,
                    oneColorForAllCols: !globalSettings.oneColorForAllCols,
                  }); */

                  if (!userIdOrNoId) {
                    setGlobalSettings({
                      ...globalSettings,
                      oneColorForAllCols: !globalSettings.oneColorForAllCols,
                    });
                    return;
                  }

                  changeSettings({
                    ...globalSettings,
                    oneColorForAllCols: !globalSettings.oneColorForAllCols,
                  });
                }}
                aria-label={"One color for all columns"}
              ></button>
            </div>
            <div className="flex justify-between items-center mb-2 mt-2">
              <p className="">Limit column width growth</p>
              <button
                className={`h-4 w-4 cursor-pointer transition duration-75 border-2 border-${uiColor} ${
                  globalSettings.limitColGrowth
                    ? `bg-${uiColor} bg-opacity-50 hover:border-opacity-30`
                    : `hover:border-opacity-50`
                } focus-1-offset-dark  `}
                onClick={() => {
                  /*   setGlobalSettings({
                    ...globalSettings,
                    limitColGrowth: !globalSettings.limitColGrowth,
                  }); */

                  if (!userIdOrNoId) {
                    setGlobalSettings({
                      ...globalSettings,
                      limitColGrowth: !globalSettings.limitColGrowth,
                    });
                    return;
                  }

                  changeSettings({
                    ...globalSettings,
                    limitColGrowth: !globalSettings.limitColGrowth,
                  });
                }}
                aria-label={"Limit column width growth"}
              ></button>
            </div>

            <div className="flex justify-between items-center mb-2 mt-2">
              <p className="">Hide folder containing all bookmarks</p>
              <button
                className={`h-4 w-4 cursor-pointer transition duration-75 border-2 border-${uiColor} ${
                  globalSettings.hideNonDeletable
                    ? `bg-${uiColor} bg-opacity-50 hover:border-opacity-30`
                    : `hover:border-opacity-50`
                } focus-1-offset-dark `}
                onClick={() => {
                  /*   setGlobalSettings({
                    ...globalSettings,
                    hideNonDeletable: !globalSettings.hideNonDeletable,
                  }); */

                  if (!userIdOrNoId) {
                    setGlobalSettings({
                      ...globalSettings,
                      hideNonDeletable: !globalSettings.hideNonDeletable,
                    });
                    return;
                  }

                  changeSettings({
                    ...globalSettings,
                    hideNonDeletable: !globalSettings.hideNonDeletable,
                  });
                }}
                aria-label={"Hide folder containing all bookmarks"}
              ></button>
            </div>
            <div className="flex justify-between items-center mb-2 mt-2">
              <p className="">Disable drag & drop</p>
              <button
                className={`h-4 w-4 cursor-pointer transition duration-75 border-2 border-${uiColor} ${
                  globalSettings.disableDrag
                    ? `bg-${uiColor} bg-opacity-50 hover:border-opacity-30`
                    : `hover:border-opacity-50`
                } focus-1-offset-dark `}
                onClick={() => {
                  /*   setGlobalSettings({
                    ...globalSettings,
                    disableDrag: !globalSettings.disableDrag,
                  }); */

                  if (!userIdOrNoId) {
                    setGlobalSettings({
                      ...globalSettings,
                      disableDrag: !globalSettings.disableDrag,
                    });
                    return;
                  }

                  changeSettings({
                    ...globalSettings,
                    disableDrag: !globalSettings.disableDrag,
                  });
                }}
                aria-label={"Disable drag and drop"}
              ></button>
            </div>

            <div className="my-0">
              <div
                className={`flex items-center mb-2 mt-2 justify-between border-${uiColor} border-t border-opacity-40`}
              >
                <p className="whitespace-nowrap w-32">RSS Display</p>

                <div className="flex">
                  <div className="flex items-center mr-2">
                    <button
                      className={`h-3 w-3 cursor-pointer transition duration-75 border-2 border-${uiColor} ${
                        globalSettings.description
                          ? `bg-${uiColor} bg-opacity-50 hover:border-opacity-30`
                          : `hover:border-opacity-50`
                      } focus-1-offset-dark `}
                      style={{ marginTop: "2px" }}
                      onClick={() => {
                        /*   setGlobalSettings({
                          ...globalSettings,
                          description: !globalSettings.description,
                        }); */

                        userIdOrNoId
                          ? changeSettings({
                              ...globalSettings,
                              description: !globalSettings.description,
                            })
                          : setGlobalSettings({
                              ...globalSettings,
                              description: !globalSettings.description,
                            });

                        setTabOpenedState(null);
                      }}
                      aria-label={"RSS description on by default"}
                    ></button>
                    <span className="ml-1 ">Description</span>
                  </div>

                  <div className="flex items-center">
                    <button
                      className={`h-3 w-3 cursor-pointer transition duration-75 border-2 border-${uiColor} ${
                        globalSettings.date
                          ? `bg-${uiColor} bg-opacity-50 hover:border-opacity-30`
                          : `hover:border-opacity-50`
                      } focus-1-offset-dark`}
                      style={{ marginTop: "2px" }}
                      onClick={() => {
                        /*      setGlobalSettings({
                          ...globalSettings,
                          date: !globalSettings.date,
                        });
                         */

                        userIdOrNoId
                          ? changeSettings({
                              ...globalSettings,
                              date: !globalSettings.date,
                            })
                          : setGlobalSettings({
                              ...globalSettings,
                              date: !globalSettings.date,
                            });

                        setTabOpenedState(null);
                      }}
                      aria-label={"RSS date on by default"}
                    ></button>
                    <span className="ml-1">Date</span>
                  </div>
                </div>
              </div>

              <div
                className={`flex items-center mt-2 pb-1 justify-between border-${uiColor} border-b border-opacity-40`}
              >
                <p className="whitespace-nowrap w-32">RSS Items per page</p>
                <input
                  type="number"
                  min="5"
                  max="15"
                  className="border w-8 text-center border-gray-300 bg-gray-50
                focus-1
                "
                  value={globalSettings.itemsPerPage}
                  onWheel={(event) => event.currentTarget.blur()}
                  onChange={(e) => {
                    /*   setGlobalSettings({
                      ...globalSettings,
                      itemsPerPage: parseInt(e.target.value),
                    }); */

                    userIdOrNoId
                      ? changeSettings({
                          ...globalSettings,
                          itemsPerPage: parseInt(e.target.value),
                        })
                      : setGlobalSettings({
                          ...globalSettings,
                          itemsPerPage: parseInt(e.target.value),
                        });

                    // changeSettings({
                    //   ...globalSettings,
                    //   itemsPerPage: parseInt(e.target.value),
                    // });

                    setTabOpenedState(null);
                  }}
                />
              </div>
            </div>

            <div className="flex justify-between items-center mb-2 mt-1">
              <p className="">Number of columns</p>
              <div className="flex">{renderColsNumberControls()}</div>
            </div>
          </div>
        </div>
      </div>
    </FocusLock>
  );
}

export default GlobalSettings;
