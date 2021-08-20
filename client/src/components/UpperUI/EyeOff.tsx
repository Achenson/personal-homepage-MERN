import React from "react";

import shallow from "zustand/shallow";

import { ReactComponent as EyeOffSVG } from "../../svgs/eye-off.svg";

import { useBackgroundColor } from "../../state/hooks/colorHooks";
import { useGlobalSettings } from "../../state/hooks/defaultSettingsHooks";
import { useEyeOff } from "../../state/hooks/useEyeOff";
import { useTabs } from "../../state/hooks/useTabs";
import { useUpperUiContext } from "../../context/upperUiContext";

import { backgroundColorsUpperUiFocus } from "../../utils/data/colors_background";

interface Props {
  setFocusOnColumnColor: React.Dispatch<
    React.SetStateAction<1 | 2 | 4 | 3 | null>
  >;
  setFocusOnBackgroundColor: React.Dispatch<React.SetStateAction<boolean>>;
}

function EyeOff({
  setFocusOnBackgroundColor,
  setFocusOnColumnColor,
}: Props): JSX.Element {
  const globalSettings = useGlobalSettings((state) => state, shallow);
  const backgroundColor = useBackgroundColor((state) => state.backgroundColor);

  const setCloseAllTabsState = useTabs((state) => state.setCloseAllTabsState);
  const setTabOpenedState = useTabs((state) => state.setTabOpenedState);
  const eyeOffEnabled = useEyeOff((state) => state.enabled);
  const setEyeOff = useEyeOff((state) => state.setEyeOff);

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
        if (eyeOffEnabled) setEyeOff(false);

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
      className={`focus:outline-none focus-visible:ring-2 ring-${focusColor()} ring-inset`}
      tabIndex={6}
      aria-label={"Reset tabs to default open/close state"}
      disabled={eyeOffEnabled ? false : true}
    >
      <EyeOffSVG
        className={`h-7 transition-colors duration-75 ${calcIconBackground(
          backgroundColor
        )} opacity-80 border border-black rounded-lg ${
          eyeOffEnabled
            ? "cursor-pointer hover:border-gray-500"
            : "cursor-default border-gray-500"
        }`}
      />
    </button>
  );
}

export default EyeOff;
