import React, { useState, useEffect } from "react";

// import shallow from "zustand/shallow";
import FocusLock from "react-focus-lock";

import Settings_inner from "./Settings_inner";
import ColorsToChoose_DefaultAndColumns from "../Colors/ColorsToChoose_DefaultAndColumns";

import { ReactComponent as CancelSVG } from "../../svgs/alphabet-x.svg";
import { ReactComponent as FolderSVG } from "../../svgs/folder.svg";
import { ReactComponent as NoteSVG } from "../../svgs/note_UXwing.svg";
import { ReactComponent as RssSVG } from "../../svgs/rss.svg";

import { useResetColors } from "../../state/hooks/colorHooks";
import { useTabs } from "../../state/hooks/useTabs";
import { useUpperUiContext } from "../../context/upperUiContext";
import { useWindowSize } from "../../utils/funcs and hooks/useWindowSize";

import { handleKeyDown_upperUiSetting } from "../../utils/funcs and hooks/handleKeyDown_upperUiSettings";
import { GlobalSettingsState } from "../../utils/interfaces";

interface Props {
  mainPaddingRight: boolean;
  scrollbarWidth: number;
  globalSettings: GlobalSettingsState;
  userIdOrNoId: string | null;
}

function ColorsSettings({
  mainPaddingRight,
  scrollbarWidth,
  globalSettings,
  userIdOrNoId,
}: Props): JSX.Element {
  const [defaultColorsFor, setDefaultColorsFor] = useState<
    "folders" | "notes" | "rss" | "unselected"
  >("unselected");

  const [colorsToChooseVis, setColorsToChooseVis] = useState<boolean>(false);

  const [foldersSelected, setFoldersSelected] = useState<boolean>(false);
  const [notesSelected, setNotesSelected] = useState<boolean>(false);
  const [rssSelected, setRssSelected] = useState<boolean>(false);

  const setResetColors = useResetColors((store) => store.setResetColors);

  // const defaultColors = useDefaultColors((state) => state, shallow);

  const setTabOpenedState = useTabs((store) => store.setTabOpenedState);

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

  // const [settingsResults] = useQuery({
  //   query: SettingsQuery,
  //   variables: { userId: testUserId },
  // });

  // const { data, fetching, error } = settingsResults;

  // if (fetching) return <p>Loading...</p>;
  // if (error) return <p>Oh no... {error.message}</p>;

  // function calcColorTop(
  //   defaultColorsFor: "folders" | "notes" | "rss" | "unselected",
  //   xsScreen: boolean
  // ) {
  //   if (!xsScreen) {
  //     return "100px";
  //   }

  //   if (defaultColorsFor === "folders") {
  //     // return "57px";
  //     return "65px";
  //   }

  //   if (defaultColorsFor === "notes") {
  //     return "97px";
  //   }

  //   if (defaultColorsFor === "rss") {
  //     return "129px";
  //   }

  //   if (defaultColorsFor === "unselected") {
  //     return "0px";
  //   }
  // }

  function calcColorLeft(
    defaultColorsFor: "folders" | "notes" | "rss" | "unselected",
    xsScreen: boolean
  ) {
    // if (xsScreen) {
    //   return "134px";
    // }

    if (defaultColorsFor === "folders") {
      // return "57px";
      return xsScreen ? "80px" :  "83px";
    }

    if (defaultColorsFor === "notes") {
      return xsScreen ?  "92px" : "126px";
    }

    if (defaultColorsFor === "rss") {
      return xsScreen ? "103px" : "171px";
    }

    if (defaultColorsFor === "unselected") {
      return "0px";
    }
  }

  function handleKeyDown(event: KeyboardEvent) {
    handleKeyDown_upperUiSetting(event.code, upperUiContext, 6, undefined);
  }

  function deselectColorsSettings() {
    setFoldersSelected(false);
    setNotesSelected(false);
    setRssSelected(false);
  }

  return (
    <FocusLock>
      <div
        className="flex flex-col z-50 fixed h-full w-screen justify-center items-center"
        style={{ backgroundColor: "rgba(90, 90, 90, 0.4)" }}
        onClick={() => {
          upperUiContext.upperVisDispatch({ type: "COLORS_SETTINGS_TOGGLE" });
        }}
      >
        <div
          // className="mb-24 md:mb-40"
          style={{ marginBottom: "263px" }}
          onClick={(e) => {
            e.stopPropagation();
            return;
          }}
        >
          <div
            className={`bg-gray-100 pb-3 pt-5 border-2 px-4 border-${globalSettings.uiColor} rounded-sm relative`}
            style={{
              width: xsScreen ? `350px` : `417px`,
              height: "200px",
              marginLeft: `${
                mainPaddingRight && scrollbarWidth >= 10
                  ? `-${scrollbarWidth - 1}px`
                  : ""
              }`,
            }}
          >
            <Settings_inner
              currentSettings={"colors"}
              globalSettings={globalSettings}
            />

            <div className="absolute right-0 top-0 mt-1 mr-1 ">
              <button
                onClick={() => {
                  upperUiContext.upperVisDispatch({
                    type: "COLORS_SETTINGS_TOGGLE",
                  });
                  upperUiContext.upperVisDispatch({
                    type: "FOCUS_ON_UPPER_RIGHT_UI",
                    payload: 6,
                  });
                }}
                className="h-5 w-5 focus-2-offset-dark"
                aria-label={"Close"}
              >
                <CancelSVG className="h-full w-full fill-current text-gray-600 cursor-pointer hover:text-gray-900" />
              </button>
            </div>

            <p className="text-center">Default tab colors</p>
            <div className="flex justify-center mt-6">
              <div className="flex justify-start items-center mb-2 mt-2">
                {/* <p style={{ width: xsScreen? "64px" : "" }}>Folders</p> */}
                <div className="h-6 w-6 xs:h-7 xs:w-7">
                  <FolderSVG className="w-full h-full" />
                </div>
                <button
                  onClick={() => {
                    setDefaultColorsFor("folders");
                    if (defaultColorsFor === "folders") {
                      setColorsToChooseVis((b) => !b);
                    } else {
                      setColorsToChooseVis(true);
                    }
                    setNotesSelected(false);
                    setRssSelected(false);
                    setFoldersSelected((b) => !b);
                    setTabOpenedState(null);
                  }}
                  className={`h-4 xs:h-5 w-10 xs:w-16 bg-${
                    globalSettings.folderColor
                  } cursor-pointer ${
                    foldersSelected ? "border-2" : "border"
                  } border-black hover:border-gray-500 focus-1-offset-dark`}
                  aria-label={"Default folders color menu"}
                ></button>
              </div>
              <div className="flex justify-start items-center mb-2 mt-2 mr-6 ml-6 xs:mr-4 xs:ml-4">
                {/* <p style={{ width: xsScreen? "64px" : "" }}>Notes</p> */}
                <div className="h-5 w-5 xs:h-6 xs:w-6 mr-px">
                  <NoteSVG className="w-full h-full" />
                </div>
                <button
                  onClick={() => {
                    setDefaultColorsFor("notes");
                    if (defaultColorsFor === "notes") {
                      setColorsToChooseVis((b) => !b);
                    } else {
                      setColorsToChooseVis(true);
                    }
                    setFoldersSelected(false);
                    setRssSelected(false);
                    setNotesSelected((b) => !b);
                    setTabOpenedState(null);
                  }}
                  className={`h-4 xs:h-5 w-10 xs:w-16 bg-${
                    globalSettings.noteColor
                  } cursor-pointer ${
                    notesSelected ? "border-2" : "border"
                  } border-black hover:border-gray-500 focus-1-offset-dark`}
                  aria-label={"Default notes color menu"}
                ></button>
              </div>
              <div className="flex  justify-start items-center mb-2 mt-2">
                {/* <p style={{ width: xsScreen? "64px" : "" }}>RSS</p> */}
                <div className="h-6 w-6 xs:h-7 xs:w-7 -mr-px">
                  <RssSVG className="w-full h-full" />
                </div>
                <button
                  onClick={() => {
                    setDefaultColorsFor("rss");
                    if (defaultColorsFor === "rss") {
                      setColorsToChooseVis((b) => !b);
                    } else {
                      setColorsToChooseVis(true);
                    }
                    setFoldersSelected(false);
                    setNotesSelected(false);
                    setRssSelected((b) => !b);
                    setTabOpenedState(null);
                  }}
                  className={`h-4 xs:h-5 w-10 xs:w-16 bg-${
                    globalSettings.rssColor
                  } cursor-pointer ${
                    rssSelected ? "border-2" : "border"
                  } border-black hover:border-gray-500 focus-1-offset-dark`}
                  aria-label={"Default RSS color menu"}
                ></button>
              </div>
            </div>

            <p className={`text-center mt-4 xs:mt-3`}>
              {" "}
              <button
                onClick={() => {
                  setResetColors(true);
                  setTabOpenedState(null);
                }}
                className="focus-1-offset"
                aria-label={"Reset colors to default"}
                disabled={colorsToChooseVis ? true : false}
              >
                <span
                  className={` ${
                    colorsToChooseVis
                      ? "cursor-default text-red-200"
                      : "hover:underline cursor-pointer text-red-600"
                  } 
              `}
                >
                  RESET
                </span>
              </button>{" "}
              <span
                className={`${
                  colorsToChooseVis ? "text-gray-200" : "text-black"
                }`}
              >
                tabs to default colors
              </span>
            </p>
            {colorsToChooseVis && (
              <div
                className="absolute"
                style={{
                  // top: calcColorTop(defaultColorsFor, xsScreen),
                  top: xsScreen ? "96px" : "100px",
                  // left: "99px",
                  // left: xsScreen ? "134px" : "155px",
                  left: calcColorLeft(defaultColorsFor, xsScreen),
                }}
              >
                <ColorsToChoose_DefaultAndColumns
                  defaultColorsFor={defaultColorsFor}
                  setColorsToChooseVis={setColorsToChooseVis}
                  globalSettings={globalSettings}
                  userIdOrNoId={userIdOrNoId}
                  deselectColorsSettings={deselectColorsSettings}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </FocusLock>
  );
}

export default ColorsSettings;
