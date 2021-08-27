import React, { useEffect, useState } from "react";

import shallow from "zustand/shallow";

import { useGlobalSettings } from "../../state/hooks/defaultSettingsHooks";

import { SingleTabData } from "../../utils/interfaces";
import { useTabContext } from "../../context/tabContext";

interface Props {
  currentTab: SingleTabData;
  isTabDraggedOver: boolean;
}

function NoteInput({ currentTab, isTabDraggedOver }: Props): JSX.Element {
  const globalSettings = useGlobalSettings((state) => state, shallow);
  const tabContext = useTabContext();

  const [focusOnNote, setFocusOnNote] = useState(false);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);

    // !!!! without this everything will be recalculated from start - lag
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  });

  function handleKeyDown(event: KeyboardEvent) {
    if (
      (event.code === "Enter" || event.code === "NumpadEnter") &&
      focusOnNote
    ) {
      tabContext.tabVisDispatch({ type: "EDIT_TOGGLE" });
    }
  }

  return (
    <div
      className={`${
        globalSettings.picBackground
          ? `${
              isTabDraggedOver ? "bg-gray-900" : "bg-gray-100"
            } bg-opacity-20 border-b border-gray-800 border-opacity-10`
          : `${
              isTabDraggedOver ? "bg-gray-100" : "bg-amber-100"
            } border border-black border-opacity-10 border-t-0`
      } p-2 `}
    >
      <div
        className={`p-2 rounded-md overflow-hidden border border-black border-opacity-10
        focus:outline-none focus-visible:ring-2 ${
          globalSettings.picBackground ? "ring-gray-50" : "ring-gray-300"
        } focus:border-opacity-0`}
        style={{
          backgroundColor: `${
            isTabDraggedOver ? "#E5E7EB" : "rgb(247, 243, 132)"
          } `,
        }}
        onDoubleClick={() => {
          if (!tabContext.tabVisState.editTabVis) {
            tabContext.tabVisDispatch({ type: "EDIT_TOGGLE" });
          }
        }}
        tabIndex={0}
        onFocus={() => setFocusOnNote(true)}
        onBlur={() => setFocusOnNote(false)}
      >
        <p className="whitespace-pre-wrap">{currentTab?.noteInput}</p>
      </div>
    </div>
  );
}

export default NoteInput;
