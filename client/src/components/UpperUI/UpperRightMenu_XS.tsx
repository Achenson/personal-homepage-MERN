import React, { useEffect, useRef } from "react";

import shallow from "zustand/shallow";

import { ReactComponent as FolderSVG } from "../../svgs/folder.svg";
import { ReactComponent as PlusSquareSVG } from "../../svgs/plus-square-line_uxwing.svg";
import { ReactComponent as BookmarkSVG } from "../../svgs/bookmarkAlt.svg";
import { ReactComponent as NoteSVG } from "../../svgs/note_UXwing.svg";
import { ReactComponent as CogSVG } from "../../svgs/cog.svg";
import { ReactComponent as UserSVG } from "../../svgs/user.svg";
import { ReactComponent as LogoutSVG } from "../../svgs/logout.svg";
import { ReactComponent as AddRssSVG } from "../../svgs/rss.svg";

import { useGlobalSettings } from "../../state/hooks/defaultSettingsHooks";
import { useDefaultColors } from "../../state/hooks/colorHooks";
import { useLoggedInState } from "../../state/hooks/useLoggedInState";

import { useUpperUiContext } from "../../context/upperUiContext";

interface Props {
  setTabType: React.Dispatch<React.SetStateAction<"folder" | "note" | "rss">>;
}

function UpperRightMenu({ setTabType }: Props): JSX.Element {
  const globalSettings = useGlobalSettings((state) => state, shallow);

  const uiColor = useDefaultColors((state) => state.uiColor);

  const loggedInState = useLoggedInState((state) => state.loggedInState);
  const setLoggedInState = useLoggedInState((state) => state.setLoggedInState);

  const colLimit = globalSettings.limitColGrowth;

  const upperUiContext = useUpperUiContext();

  let focusOnUpperRightUi_xs_ref_1 = useRef<HTMLButtonElement>(null);
  let focusOnUpperRightUi_xs_ref_2 = useRef<HTMLButtonElement>(null);
  let focusOnUpperRightUi_xs_ref_3 = useRef<HTMLButtonElement>(null);
  let focusOnUpperRightUi_xs_ref_4 = useRef<HTMLButtonElement>(null);
  // no ref 6 & 7 in UpperRightMenu_XS as there is only one SVG for all settings
  let focusOnUpperRightUi_xs_ref_5 = useRef<HTMLButtonElement>(null);
  let focusOnUpperRightUi_xs_ref_8 = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (
      focusOnUpperRightUi_xs_ref_1.current !== null &&
      focusOnUpperRightUi_xs_ref_5.current !== null &&
      focusOnUpperRightUi_xs_ref_8.current !== null &&
      upperUiContext.upperVisState.focusOnUpperRightUi
    ) {
      switch (upperUiContext.upperVisState.focusOnUpperRightUi) {
        case 1:
          focusOnUpperRightUi_xs_ref_1.current.focus();
          return;
        // 2,3 & 4 visible only if plus SVG is clicked
        case 2:
          if (focusOnUpperRightUi_xs_ref_2.current) {
            focusOnUpperRightUi_xs_ref_2.current.focus();
          }
          return;
        case 3:
          if (focusOnUpperRightUi_xs_ref_3.current) {
            focusOnUpperRightUi_xs_ref_3.current.focus();
          }
          return;
        case 4:
          if (focusOnUpperRightUi_xs_ref_4.current) {
            focusOnUpperRightUi_xs_ref_4.current.focus();
          }
          return;
        case 5:
        case 6:
        case 7:
          focusOnUpperRightUi_xs_ref_5.current.focus();
          return;
        case 8:
          focusOnUpperRightUi_xs_ref_8.current.focus();
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
    <>
      {upperUiContext.upperVisState.addTagVis_xs && (
        <div
          className={`flex ${xsDisplay(
            "sm:hidden",
            "xs:hidden"
          )} justify-around`}
        >
          <button
            ref={focusOnUpperRightUi_xs_ref_2}
            className="h-7 w-7 focus-2-inset-veryDark"
            style={{ marginLeft: "0px" }}
            onClick={() => {
              upperUiContext.upperVisDispatch({ type: "NEW_TAB_TOGGLE" });
              setTabType("folder");
            }}
            tabIndex={7}
            aria-label={"New folder"}
          >
            <FolderSVG
              className={`h-7 w-7 cursor-pointer transition-colors duration-75 hover:text-${uiColor}`}
            />
          </button>

          <button
            ref={focusOnUpperRightUi_xs_ref_3}
            className="h-6 w-6 focus-2-veryDark"
            style={{ marginTop: "2px", marginLeft: "0px" }}
            onClick={() => {
              upperUiContext.upperVisDispatch({ type: "NEW_TAB_TOGGLE" });
              setTabType("note");
            }}
            tabIndex={8}
            aria-label={"New note"}
          >
            <NoteSVG
              className={`h-6 w-6 cursor-pointer fill-current transition-colors duration-75 text-black hover:text-${uiColor}`}
            />
          </button>

          <button
            ref={focusOnUpperRightUi_xs_ref_4}
            className="h-7 w-7 focus-2-inset-veryDark"
            style={{ marginRight: "-2px" }}
            onClick={() => {
              upperUiContext.upperVisDispatch({ type: "NEW_TAB_TOGGLE" });
              setTabType("rss");
            }}
            tabIndex={9}
            aria-label={"New rss"}
          >
            <AddRssSVG
              className={`h-7 w-7 cursor-pointer transition-colors duration-75 hover:text-${uiColor}`}
            />
          </button>

          <UserSVG
            className={`invisible h-6 self-center cursor-pointer transition-colors duration-75 hover:text-${uiColor}`}
          />
        </div>
      )}

      <div
        className={`flex ${xsDisplay("sm:hidden", "xs:hidden")} justify-around`}
        style={{ marginTop: "-1px" }}
      >
        <button
          ref={focusOnUpperRightUi_xs_ref_1}
          className="h-7 w-7 focus-2-inset-veryDark"
          onClick={() => {
            upperUiContext.upperVisDispatch({ type: "NEW_BOOKMARK_TOGGLE" });
          }}
          tabIndex={10}
          aria-label={"New bookmark"}
        >
          <BookmarkSVG
            className={`h-7 w-7 cursor-pointer transition-colors duration-75 hover:text-${uiColor}`}
          />
        </button>
        <button
          className="h-6 w-5 self-center focus-2-veryDark"
          style={{ width: "22px" }}
          onClick={() => {
            upperUiContext.upperVisDispatch({ type: "ADD_TAG_XS_TOGGLE" });
          }}
          tabIndex={11}
          aria-label={"New tab menu"}
        >
          <PlusSquareSVG
            className={`h-5 w-5 cursor-pointer transition-colors duration-75 fill-current hover:text-${uiColor} ml-px`}
          />
        </button>

        <button
          ref={focusOnUpperRightUi_xs_ref_5}
          className="h-6 w-6 ml-0.5 focus-2-veryDark"
          style={{ marginTop: "2px" }}
          onClick={() => {
            switch (upperUiContext.upperVisState.currentXSsettings) {
              case "background":
                upperUiContext.upperVisDispatch({
                  type: "BACKGROUND_SETTINGS_TOGGLE",
                });
                return;
              case "colors":
                upperUiContext.upperVisDispatch({
                  type: "COLORS_SETTINGS_TOGGLE",
                });
                return;
              case "global":
                upperUiContext.upperVisDispatch({ type: "SETTINGS_TOGGLE" });
                return;
              default:
                upperUiContext.upperVisDispatch({
                  type: "COLORS_SETTINGS_TOGGLE",
                });
            }
          }}
          tabIndex={12}
          aria-label={"Settings"}
        >
          <CogSVG
            className={`h-full w-full cursor-pointer transition-colors duration-75  hover:text-${uiColor}`}
          />
        </button>
        <div className="self-center" style={{ width: "24px", height: "24px" }}>
          {loggedInState ? (
            <button
              ref={focusOnUpperRightUi_xs_ref_8}
              className="h-6 w-5 focus-2-veryDark"
              style={{ width: "22px" }}
              onClick={() => {
                setLoggedInState(false);
                upperUiContext.upperVisDispatch({
                  type: "MESSAGE_OPEN_LOGOUT",
                });
              }}
              tabIndex={13}
              aria-label={"Logout"}
            >
              <LogoutSVG
                className={`h-6 w-6 cursor-pointer transition-colors duration-75 hover:text-${uiColor}`}
                style={{ marginLeft: "-1px" }}
              />
            </button>
          ) : (
            <button
              ref={focusOnUpperRightUi_xs_ref_8}
              className="h-6 w-5 focus-2-veryDark"
              style={{ width: "18px" }}
              onClick={() => {
                upperUiContext.upperVisDispatch({ type: "PROFILE_TOGGLE" });
              }}
              tabIndex={13}
              aria-label={"Login/register"}
            >
              <UserSVG
                className={`h-6 w-6 cursor-pointer transition-colors duration-75 hover:text-${uiColor}`}
                style={{ marginLeft: "-3px", marginBottom: "0px" }}
              />
            </button>
          )}
        </div>
      </div>
    </>
  );
}

export default UpperRightMenu;
