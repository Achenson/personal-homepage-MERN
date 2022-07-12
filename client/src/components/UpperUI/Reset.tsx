import React from "react";

// import shallow from "zustand/shallow";

import { ReactComponent as ResetSVG } from "../../svgs/reset-update.svg";

// import { useBackgroundColor } from "../../state/hooks/colorHooks";
// import { useGlobalSettings } from "../../state/hooks/defaultSettingsHooks";
import { useReset } from "../../state/hooks/useReset";
import { useTabs } from "../../state/hooks/useTabs";
import { useUpperUiContext } from "../../context/upperUiContext";

import { backgroundColorsUpperUiFocus } from "../../utils/data/colors_background";

import { UseGlobalSettingsAll } from "../../state/hooks/defaultSettingsHooks";

import { SettingsDatabase_i } from "../../../../schema/types/settingsType";

interface Props {
  setFocusOnColumnColor: React.Dispatch<
    React.SetStateAction<1 | 2 | 4 | 3 | null>
  >;
  setFocusOnBackgroundColor: React.Dispatch<React.SetStateAction<boolean>>;
  globalSettings: SettingsDatabase_i | UseGlobalSettingsAll
}

function Reset({
  setFocusOnBackgroundColor,
  setFocusOnColumnColor,
  globalSettings
}: Props): JSX.Element {
  // const globalSettings = useGlobalSettings((state) => state, shallow);
  // const backgroundColor = useBackgroundColor((state) => state.backgroundColor);
  const backgroundColor = globalSettings.backgroundColor;

  const setCloseAllTabsState = useTabs((state) => state.setCloseAllTabsState);
  const setTabOpenedState = useTabs((state) => state.setTabOpenedState);
  const resetEnabled = useReset((state) => state.enabled);
  const setReset = useReset((state) => state.setReset);

  const upperUiContext = useUpperUiContext();

  function calcIconBackground(pageBackgroundColor: string) {
    if (pageBackgroundColor === "white") {
      return `$bg-${pageBackgroundColor}`;
    }

    if (pageBackgroundColor === "black") {
      return `bg-white text-${backgroundColor}`;
    }

    let whiteRegex = /[3456789]00$/;

    if (globalSettings.picBackground) {
      return "bg-white text-black";
    }

    if (whiteRegex.test(pageBackgroundColor)) {
      return `bg-white text-${backgroundColor}`;
    } else {
      return `$bg-${pageBackgroundColor}`;
    }
  }

  function focusColor(): string {
    if (globalSettings.picBackground) {
      return "blueGray-400";
    }

    if (backgroundColorsUpperUiFocus.indexOf(backgroundColor) > -1) {
      return "blueGray-300";
    }

    return "blueGray-400";
  }

  return (
    <button
      onClick={() => {
        upperUiContext.upperVisDispatch({ type: "CLOSE_ALL" });
        setCloseAllTabsState(true);
        setTabOpenedState(null);
        if (resetEnabled) setReset(false);
        if (!globalSettings.picBackground) {
          setFocusOnBackgroundColor(true);
          return;
        }
        if (globalSettings.oneColorForAllCols) {
          setFocusOnColumnColor(1);
        } else {
          setFocusOnColumnColor(globalSettings.numberOfCols);
        }
      }}
      className={`h-7 w-7 flex justify-center items-center transition-colors duration-75 ${calcIconBackground(
        backgroundColor
      )} opacity-80 border border-black rounded-lg ${
        resetEnabled
          ? " hover:border-gray-500 cursor-pointer"
          : " border-gray-500 cursor-default"
      } focus:outline-none focus-visible:ring-2 ring-${focusColor()}`}
      tabIndex={6}
      aria-label={"Reset tabs to default open/close state"}
      disabled={resetEnabled ? false : true}
    >
      <ResetSVG
        style={{
          height: "21px",
          marginLeft: "0px"
        }}
      />
    </button>
  );
}

export default Reset;
