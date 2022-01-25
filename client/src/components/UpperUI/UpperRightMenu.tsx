import React, { useEffect, useRef } from "react";
import { useMutation } from "urql";

import shallow from "zustand/shallow";

import UpperRightMenu_XS from "./UpperRightMenu_XS";

import { ReactComponent as FolderSVG } from "../../svgs/folder.svg";
import { ReactComponent as BookmarkSVG } from "../../svgs/bookmarkAlt.svg";
import { ReactComponent as NoteSVG } from "../../svgs/note_UXwing.svg";
import { ReactComponent as SettingsSVG } from "../../svgs/settingsAlt.svg";
import { ReactComponent as UserSVG } from "../../svgs/user.svg";
import { ReactComponent as LogoutSVG } from "../../svgs/logout.svg";
import { ReactComponent as ColorSVG } from "../../svgs/beaker.svg";
import { ReactComponent as AddRssSVG } from "../../svgs/rss.svg";
import { ReactComponent as PhotographSVG } from "../../svgs/photograph.svg";

// import { useLoggedInState } from "../../state/hooks/useLoggedInState";
// import { useGlobalSettings } from "../../state/hooks/defaultSettingsHooks";
// import { useDefaultColors } from "../../state/hooks/colorHooks";
import { useTabs } from "../../state/hooks/useTabs";
import { useUpperUiContext } from "../../context/upperUiContext";
import { AuthContext, useAuthContext } from "../../context/authContext";

import {LogoutMutation } from "../../graphql/graphqlMutations";

import { SettingsDatabase_i } from "../../../../schema/types/settingsType";

interface Props {
  setTabType: React.Dispatch<React.SetStateAction<"folder" | "note" | "rss">>;
  globalSettings: SettingsDatabase_i;
}

function UpperRightMenu({ setTabType, globalSettings }: Props): JSX.Element {
  // const globalSettings = useGlobalSettings((state) => state, shallow);

  // const uiColor = useDefaultColors((state) => state.uiColor);
  const uiColor = globalSettings.uiColor;

  // const loggedInState = useLoggedInState((state) => state.loggedInState);
  // const setLoggedInState = useLoggedInState((state) => state.setLoggedInState);

  const setFocusedTabState = useTabs((state) => state.setFocusedTabState);

  const upperUiContext = useUpperUiContext();
  const authContext = useAuthContext();

  const colLimit = globalSettings.limitColGrowth;

  let focusOnUpperRightUi_ref_1 = useRef<HTMLButtonElement>(null);
  let focusOnUpperRightUi_ref_2 = useRef<HTMLButtonElement>(null);
  let focusOnUpperRightUi_ref_3 = useRef<HTMLButtonElement>(null);
  let focusOnUpperRightUi_ref_4 = useRef<HTMLButtonElement>(null);
  let focusOnUpperRightUi_ref_5 = useRef<HTMLButtonElement>(null);
  let focusOnUpperRightUi_ref_6 = useRef<HTMLButtonElement>(null);
  let focusOnUpperRightUi_ref_7 = useRef<HTMLButtonElement>(null);
  let focusOnUpperRightUi_ref_8 = useRef<HTMLButtonElement>(null);

  const [logoutMutResult, logoutMut] = useMutation<any, any>(
    LogoutMutation
  );

  useEffect(() => {
    if (
      focusOnUpperRightUi_ref_1.current !== null &&
      focusOnUpperRightUi_ref_2.current !== null &&
      focusOnUpperRightUi_ref_3.current !== null &&
      focusOnUpperRightUi_ref_4.current !== null &&
      focusOnUpperRightUi_ref_5.current !== null &&
      focusOnUpperRightUi_ref_6.current !== null &&
      focusOnUpperRightUi_ref_7.current !== null &&
      focusOnUpperRightUi_ref_8.current !== null &&
      upperUiContext.upperVisState.focusOnUpperRightUi
    ) {
      switch (upperUiContext.upperVisState.focusOnUpperRightUi) {
        case 1:
          focusOnUpperRightUi_ref_1.current.focus();
          return;
        case 2:
          focusOnUpperRightUi_ref_2.current.focus();
          return;
        case 3:
          focusOnUpperRightUi_ref_3.current.focus();
          return;
        case 4:
          focusOnUpperRightUi_ref_4.current.focus();
          return;
        case 5:
          focusOnUpperRightUi_ref_5.current.focus();
          return;
        case 6:
          focusOnUpperRightUi_ref_6.current.focus();
          return;
        case 7:
          focusOnUpperRightUi_ref_7.current.focus();
          return;
        case 8:
          focusOnUpperRightUi_ref_8.current.focus();
          return;
      }
    }

    upperUiContext.upperVisDispatch({
      type: "FOCUS_ON_UPPER_RIGHT_UI",
      payload: null,
    });
  }, [upperUiContext.upperVisState.focusOnUpperRightUi]);

  // xs or normal display depending on numberOfCols && col width limit
  function xsDisplay(str_1: string, str_2: string) {
    if (colLimit) {
      // setting always in xs mode in case of colLimit && numberOfCols === 1
      if (globalSettings.numberOfCols === 1) return "";
      return str_1;
    }
    return str_2;
  }

  return (
    <div
      onFocus={() => {
        setFocusedTabState(null);
      }}
      className={`${upperUiContext.upperVisState.addTagVis_xs ? "h-14" : "h-7"}
        ${xsDisplay("sm:h-7", "xs:h-7")}
      w-28 ${xsDisplay("sm:w-56", "xs:w-56")} ${xsDisplay(
        "sm:flex",
        "xs:flex"
      )}  justify-between items-center bg-white bg-opacity-80 rounded-md border border-gray-700 `}
      style={{ marginBottom: "2px" }}
    >
      <div
        className={`hidden ${xsDisplay(
          "sm:flex",
          "xs:flex"
        )} w-28 justify-around`}
      >
        <button
          ref={focusOnUpperRightUi_ref_1}
          className="h-7 w-7 focus-2-inset-veryDark"
          onClick={() => {
            upperUiContext.upperVisDispatch({ type: "NEW_BOOKMARK_TOGGLE" });
          }}
          tabIndex={7}
          aria-label={"New bookmark"}
        >
          <BookmarkSVG
            className={`h-7 w-7 cursor-pointer transition-colors duration-75 hover:text-${uiColor}`}
          />
        </button>
        <button
          ref={focusOnUpperRightUi_ref_2}
          className="h-7 w-7 focus-2-inset-veryDark"
          onClick={() => {
            upperUiContext.upperVisDispatch({ type: "NEW_TAB_TOGGLE" });
            setTabType("folder");
          }}
          tabIndex={8}
          aria-label={"New folder"}
        >
          <FolderSVG
            className={`h-7 w-7 cursor-pointer transition-colors duration-75 hover:text-${uiColor} mr-1`}
          />
        </button>
        <button
          ref={focusOnUpperRightUi_ref_3}
          className="h-6 w-6 focus-2-veryDark"
          style={{ marginTop: "2px" }}
          onClick={() => {
            upperUiContext.upperVisDispatch({ type: "NEW_TAB_TOGGLE" });
            setTabType("note");
          }}
          tabIndex={9}
          aria-label={"New note"}
        >
          <NoteSVG
            className={`h-6 w-6 cursor-pointer fill-current transition-colors duration-75 text-black hover:text-${uiColor}`}
          />
        </button>
        <button
          ref={focusOnUpperRightUi_ref_4}
          className="h-7 w-7 focus-2-inset-veryDark"
          onClick={() => {
            upperUiContext.upperVisDispatch({ type: "NEW_TAB_TOGGLE" });
            setTabType("rss");
          }}
          tabIndex={10}
          aria-label={"New RSS channel"}
        >
          <AddRssSVG
            className={`h-7 w-7 cursor-pointer transition-colors duration-75 hover:text-${uiColor}`}
          />
        </button>
      </div>
      {/* XS============================== */}
      <UpperRightMenu_XS
        setTabType={setTabType}
        globalSettings={globalSettings}
      />
      {/* xs ============================^ */}

      <div
        className={`hidden ${xsDisplay(
          "sm:flex",
          "xs:flex"
        )}  w-24 justify-around items-center mr-0.5`}
      >
        <button
          ref={focusOnUpperRightUi_ref_5}
          className="h-6 w-6 focus-2-veryDark"
          onClick={() => {
            upperUiContext.upperVisDispatch({
              type: "BACKGROUND_SETTINGS_TOGGLE",
            });
          }}
          tabIndex={11}
          aria-label={"Background mode"}
        >
          <PhotographSVG
            className={`h-full w-full cursor-pointer transition-colors duration-75 hover:text-${uiColor} `}
          />
        </button>

        <button
          ref={focusOnUpperRightUi_ref_6}
          className="h-6 w-6 focus-2-veryDark"
          onClick={() => {
            upperUiContext.upperVisDispatch({ type: "COLORS_SETTINGS_TOGGLE" });
          }}
          tabIndex={12}
          aria-label={"Default tab colors"}
        >
          <ColorSVG
            className={`h-full w-full cursor-pointer transition-colors duration-75 hover:text-${uiColor}`}
          />
        </button>

        <button
          ref={focusOnUpperRightUi_ref_7}
          className="h-6 w-6 focus-2-veryDark"
          onClick={() => {
            upperUiContext.upperVisDispatch({ type: "SETTINGS_TOGGLE" });
          }}
          tabIndex={13}
          aria-label={"Global settings"}
        >
          <SettingsSVG
            className={`h-full w-full cursor-pointer transition-colors duration-75 hover:text-${uiColor}`}
          />
        </button>

        <div style={{ width: "24px", height: "24px" }}>
          {authContext.isAuthenticated ? (
            <button
              ref={focusOnUpperRightUi_ref_8}
              className="h-6 w-6 focus-2-inset-veryDark"
              onClick={() => {
                // setLoggedInState(false);
                logoutMut()
                authContext.updateAuthContext({...authContext,
                isAuthenticated: false,
                authenticatedUserId: null,
                accessToken: null
                })
                upperUiContext.upperVisDispatch({
                  type: "MESSAGE_OPEN_LOGOUT",
                });
              }}
              tabIndex={14}
              aria-label={"Logout"}
            >
              <LogoutSVG
                className={`h-6 w-6 cursor-pointer transition-colors duration-75 hover:text-${uiColor}`}
                style={{ marginLeft: "0px" }}
              />
            </button>
          ) : (
            <button
              ref={focusOnUpperRightUi_ref_8}
              className="h-6 w-5 focus-2-veryDark"
              onClick={() => {
                upperUiContext.upperVisDispatch({ type: "PROFILE_TOGGLE" });
              }}
              tabIndex={14}
              aria-label={"Login/register"}
            >
              <UserSVG
                className={`h-6 w-6 cursor-pointer transition-colors duration-75 hover:text-${uiColor}`}
                style={{ marginLeft: "-2px", marginBottom: "0px" }}
              />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default UpperRightMenu;
