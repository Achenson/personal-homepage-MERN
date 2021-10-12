import React, { useEffect, useState } from "react";

// import shallow from "zustand/shallow";

// import { useGlobalSettings } from "../../state/hooks/defaultSettingsHooks";
// import { useBackgroundColor } from "../../state/hooks/colorHooks";

import { backgroundColors } from "../../utils/data/colors_background";
import { useUpperUiContext } from "../../context/upperUiContext";
import "../../utils/fade.css";

import { SettingsDatabase_i } from "../../../../schema/types/settingsType";

interface Props {
  globalSettings: SettingsDatabase_i;
}

function Message({ globalSettings }: Props): JSX.Element {
  // const globalSettings = useGlobalSettings((state) => state, shallow);

  const [close, setClose] = useState(false);
  const [fadeInEnd, setFadeInEnd] = useState(false);

  // const backgroundColor = useBackgroundColor((state) => state.backgroundColor);
  const backgroundColor = globalSettings.backgroundColor;
  const upperUiContext = useUpperUiContext();

  useEffect(() => {
    if (fadeInEnd) {
      setClose(true);
    }
  }, [fadeInEnd, setClose]);

  // instant animation change when message changes:
  //  setting state to initial
  useEffect(() => {
    if (upperUiContext.upperVisState.messagePopup) {
      setClose(false);
      setFadeInEnd(false);
    }
  }, [upperUiContext.upperVisState.messagePopup, setClose, setFadeInEnd]);

  function makeBackgroundColor(): string {
    if (globalSettings.picBackground) {
      return "white";
    }

    if (backgroundColor === backgroundColors[0][0]) {
      return "blueGray-50";
    }

    if (backgroundColor === backgroundColors[0][1]) {
      return "blueGray-100";
    }

    return "white";
  }

  return (
    <div
      className={`absolute flex justify-center items-center right-0 h-16 w-28 xs:w-40 -top-32 text-center bg-${makeBackgroundColor()} bg-opacity-80 rounded-md `}
      style={{ animation: `${close ? "fadeOut" : "fadeIn"} 2s` }}
      onAnimationEnd={() => {
        // runs after fadeIn
        if (!close) {
          setFadeInEnd(true);
        }
        // runs after fadeOut
        if (close) {
          upperUiContext.upperVisDispatch({ type: "MESSAGE_CLOSE" });
        }
      }}
    >
      <p className="">{upperUiContext.upperVisState.messagePopup}</p>
    </div>
  );
}

export default Message;
