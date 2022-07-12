import React, { useEffect, useRef, useState } from "react";

// import shallow from "zustand/shallow";

import ColorsToChoose_Background from "../Colors/ColorsToChoose_Background";
import { ReactComponent as DocumentSVG } from "../../svgs/document.svg";

// import { useBackgroundColor } from "../../state/hooks/colorHooks";
// import { useGlobalSettings } from "../../state/hooks/defaultSettingsHooks";
import { useUpperUiContext } from "../../context/upperUiContext";

import { backgroundColorsUpperUiFocus } from "../../utils/data/colors_background";

import { SettingsDatabase_i } from "../../../../schema/types/settingsType";

import { UseGlobalSettingsAll } from "../../state/hooks/defaultSettingsHooks";

interface Props {
  focusOnBackgroundColor: boolean;
  setFocusOnBackgroundColor: React.Dispatch<React.SetStateAction<boolean>>;
  globalSettings: SettingsDatabase_i | UseGlobalSettingsAll;
}

function BackgroundColor({
  focusOnBackgroundColor,
  setFocusOnBackgroundColor,
  globalSettings
}: Props): JSX.Element {
  // const globalSettings = useGlobalSettings((state) => state, shallow);
  // const backgroundColor = useBackgroundColor((state) => state.backgroundColor);
  const backgroundColor = globalSettings.backgroundColor;

  const [selected, setSelected] = useState(false);

  const upperUiContext = useUpperUiContext();

  let focusOnBackgroundColor_ref = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (focusOnBackgroundColor_ref.current !== null && focusOnBackgroundColor) {
      focusOnBackgroundColor_ref.current.focus();
      setFocusOnBackgroundColor(false);
    }
  }, [focusOnBackgroundColor, setFocusOnBackgroundColor]);

  function calcIconBackground(pageBackgroundColor: string) {
    if (pageBackgroundColor === "white") {
      return `$bg-${pageBackgroundColor}`;
    }

    if (pageBackgroundColor === "black") {
      return `bg-white fill-current text-${backgroundColor}`;
    }

    let whiteRegex = /[3456789]00$/;

    if (whiteRegex.test(pageBackgroundColor)) {
      return `bg-white fill-current text-${backgroundColor}`;
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
    <>
      <button
        ref={focusOnBackgroundColor_ref}
        className={`h-7 w-7 flex items-center relative transition-colors duration-75 ${calcIconBackground(
          backgroundColor
        )} opacity-80 border border-black rounded-lg cursor-pointer hover:border-gray-500 focus:outline-none focus-visible:ring-2 ring-${focusColor()}`}
        onClick={() => {
          setSelected((b) => !b);
          upperUiContext.upperVisDispatch({ type: "COLORS_BACKGROUND_TOGGLE" });
        }}
        tabIndex={5}
        aria-label={"Background color menu"}
      >
        <DocumentSVG className={`h-7`} />
      </button>
      {upperUiContext.upperVisState.colorsBackgroundVis && (
        <div className="absolute">
          <ColorsToChoose_Background
            setFocusOnBackgroundColor={setFocusOnBackgroundColor}
            globalSettings={globalSettings}
          />
        </div>
      )}
    </>
  );
}

export default BackgroundColor;
