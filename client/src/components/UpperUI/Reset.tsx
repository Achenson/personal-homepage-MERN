import React from "react";

// import shallow from "zustand/shallow";

import { ReactComponent as ResetSVG } from "../../svgs/reset-update.svg";

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

  const setCloseAllTabsState = useTabs((store) => store.setCloseAllTabsState);
  const setTabOpenedState = useTabs((store) => store.setTabOpenedState);
  const resetEnabled = useReset((store) => store.enabled);
  const setReset = useReset((store) => store.setReset);

  const upperUiContext = useUpperUiContext();

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
      className={`h-7 w-7 flex justify-center items-center transition-colors duration-75
      bg-white
      opacity-80 border border-black rounded-lg ${
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
