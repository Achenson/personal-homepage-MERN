import React, { useEffect, useState } from "react";

// import shallow from "zustand/shallow";

// import { useGlobalSettings } from "../../state/hooks/defaultSettingsHooks";

import { backgroundColors } from "../../utils/data/colors_background";
import { useUpperUiContext } from "../../context/upperUiContext";
import "../../utils/fade.css";

import { SettingsDatabase_i } from "../../../../schema/types/settingsType";

import { UseGlobalSettingsAll } from "../../state/hooks/defaultSettingsHooks";
import { useAuth } from "../../state/hooks/useAuth";

interface Props {
  globalSettings: SettingsDatabase_i | UseGlobalSettingsAll;
}

function Message({ globalSettings }: Props): JSX.Element {
  // const globalSettings = useGlobalSettings((state) => state, shallow);

  const [close, setClose] = useState(false);
  const [fadeInEnd, setFadeInEnd] = useState(false);

  // const backgroundColor = useBackgroundColor((state) => state.backgroundColor);
  const backgroundColor = globalSettings.backgroundColor;
  // const upperUiContext = useUpperUiContext();
  const messagePopup = useAuth().messagePopup
  const setMessagePopup = useAuth().setMessagePopup

  useEffect(() => {
    if (fadeInEnd) {
      setClose(true);
    }
  }, [fadeInEnd, setClose]);

  // instant animation change when message changes:
  //  setting state to initial
  useEffect(() => {
    if (messagePopup) {
      setClose(false);
      setFadeInEnd(false);
    }
  }, [messagePopup, setClose, setFadeInEnd]);

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

  // onMount: fadeIn amination starts -> animation ends -> setFadeInEnd(true) -> useEffect - setClose(false)
  //  -> fadeOut animation starts -> animation ends -> setMessagePopup(null) - component is not rendered anymore
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
          // upperUiContext.upperVisDispatch({ type: "MESSAGE_CLOSE" });
          setMessagePopup(null)
        }
      }}
    >
      <p className="">{messagePopup}</p>
    </div>
  );
}

export default Message;
