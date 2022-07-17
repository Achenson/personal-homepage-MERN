import React from "react";

// import shallow from "zustand/shallow";

import { ReactComponent as PhotographSVG } from "../../svgs/photograph.svg";
import { ReactComponent as ColorSVG } from "../../svgs/beaker.svg";
import { ReactComponent as SettingsSVG } from "../../svgs/settingsAlt.svg";

// import { useGlobalSettings } from "../../state/hooks/defaultSettingsHooks";
// import { useDefaultColors } from "../../state/hooks/colorHooks";

import { useUpperUiContext } from "../../context/upperUiContext";

import { SettingsDatabase_i } from "../../../../schema/types/settingsType";
import {
  useGlobalSettings,
  UseGlobalSettingsAll,
} from "../../state/hooks/defaultSettingsHooks";

interface Props {
  currentSettings: "background" | "colors" | "global";
  globalSettings: SettingsDatabase_i | UseGlobalSettingsAll;
}

function Settings_inner_xs({
  currentSettings,
  globalSettings,
}: Props): JSX.Element {
  // const uiColor = useDefaultColors((state) => state.uiColor);
  const uiColor = globalSettings.uiColor;

  const upperUiContext = useUpperUiContext();

  // const globalSettings = useGlobalSettings((state) => state, shallow);

  // inner settings vis depending on numberOfCols && col width limit
  function innerSettingsVis() {
    if (globalSettings.limitColGrowth) {
      // inner setting always visible in case of colLimit && numberOfCols === 1
      if (globalSettings.numberOfCols === 1) return "";
      return "sm:hidden";
    }
    return "xs:hidden";
  }

  return (
    <div
      className={` ${innerSettingsVis()}  absolute top-5
        flex items-center justify-between
         `}
      style={{ width: "75px", left: "14px" }}
    >
      <button
        className="h-6 w-6 focus-1-dark"
        onClick={() => {
          if (currentSettings === "background") return;
          upperUiContext.upperVisDispatch({
            type: "CURRENT_XS_SETTINGS_BACKGROUND",
          });
        }}
      >
        <PhotographSVG
          className={`h-full w-full transition-colors duration-75 
            ${
              currentSettings === "background"
                ? "text-gray-800 cursor-default"
                : `text-blueGray-400 cursor-pointer hover:text-${uiColor}`
            }
            `}
          aria-label={"Background mode"}
        />
      </button>

      <button
        className="h-6 w-6 focus-1-dark"
        onClick={() => {
          if (currentSettings === "colors") return;

          upperUiContext.upperVisDispatch({
            type: "CURRENT_XS_SETTINGS_COLORS",
          });
        }}
        aria-label={"Default tab colors"}
      >
        <ColorSVG
          className={`h-full w-full  transition-colors duration-75 
            ${
              currentSettings === "colors"
                ? "text-gray-800 cursor-default"
                : `text-blueGray-400 cursor-pointer hover:text-${uiColor}`
            }
            `}
          style={{ marginRight: "-1px" }}
        />
      </button>
      <button
        className="h-6 w-6 focus-1-dark"
        onClick={() => {
          if (currentSettings === "global") return;
          upperUiContext.upperVisDispatch({
            type: "CURRENT_XS_SETTINGS_GLOBAL",
          });
        }}
        aria-label={"Global settings"}
      >
        <SettingsSVG
          className={`h-full w-full transition-colors duration-75 
            ${
              currentSettings === "global"
                ? "text-gray-800 cursor-default"
                : `text-blueGray-400 cursor-pointer hover:text-${uiColor}`
            }
            `}
        />
      </button>
    </div>
  );
}

export default Settings_inner_xs;
