import React, { useEffect, useRef } from "react";

import shallow from "zustand/shallow";

import { useGlobalSettings } from "../../state/hooks/defaultSettingsHooks";
import {
  useColumnsColors,
  useColumnsColorsImg,
} from "../../state/hooks/colorHooks";
import { useTabs } from "../../state/hooks/useTabs";
import { useUpperUiContext } from "../../context/upperUiContext";

interface Props {
  setDefaultColorsFor: React.Dispatch<
    React.SetStateAction<
      "column_1" | "column_2" | "column_3" | "column_4" | "unselected"
    >
  >;
  focusOnColumnColor: null | 1 | 2 | 3 | 4;
  setFocusOnColumnColor: React.Dispatch<
    React.SetStateAction<null | 1 | 2 | 3 | 4>
  >;
}

function ColumnColor_OneColorX4({
  setDefaultColorsFor,
  focusOnColumnColor,
  setFocusOnColumnColor,
}: Props): JSX.Element {
  const globalSettings = useGlobalSettings((state) => state, shallow);
  const columnsColors = useColumnsColors((state) => state, shallow);
  const columnsColorsImg = useColumnsColorsImg((state) => state, shallow);
  const setTabOpenedState = useTabs((state) => state.setTabOpenedState);

  const upperUiContext = useUpperUiContext();

  let focusOnAllColumnColors_ref = useRef<HTMLButtonElement>(null);

  let arrOfCols = [];

  for (let i = 1; i <= globalSettings.numberOfCols; i++) {
    arrOfCols.push(i);
  }

  useEffect(() => {
    if (
      focusOnAllColumnColors_ref.current !== null &&
      focusOnColumnColor === 1
    ) {
      focusOnAllColumnColors_ref.current.focus();
      setFocusOnColumnColor(null);
    }
  }, [focusOnColumnColor, setFocusOnColumnColor]);

  function borderStyle(arrIndex: number) {
    // unselected column
    if (upperUiContext.upperVisState.columnSelected !== 1) {
      if (arrIndex > 0) {
        return "border border-l-0";
      }
      return "border";
    }
    // selected column
    if (arrIndex > 0) {
      return "border border-t-2 border-b-2 border-r-2 border-l-0";
    }
    return "border-2";
  }

  function calcWidth(numberOfCols: 1 | 2 | 3 | 4) {
    return (32 - (4 - numberOfCols)).toString();
  }

  return (
    <div
      className={`h-4 w-${calcWidth(globalSettings.numberOfCols)} ${
        globalSettings.picBackground
          ? "bg-white opacity-80"
          : `bg-${columnsColors.column_1}`
      }`}
    >
      <button
        ref={focusOnAllColumnColors_ref}
        onClick={() => {
          setDefaultColorsFor(`column_1` as any);
          setTabOpenedState(null);

          if (upperUiContext.upperVisState.columnSelected === 1) {
            upperUiContext.upperVisDispatch({ type: "COLORS_COLUMN_TOGGLE" });
          } else {
            upperUiContext.upperVisDispatch({
              type: "COLORS_COLUMN_OPEN",
              payload: 1,
            });
          }
        }}
        className={`flex hover:shadow-inner_lg 
        focus:outline-none focus-visible:ring-4 
        ring-inset ring-blueGray-500`}
        style={{
          backgroundColor: `${
            globalSettings.picBackground ? columnsColorsImg.column_1 : ""
          }`,
        }}
        tabIndex={1}
      >
        {arrOfCols.map((el, i) => (
          <div className={`h-4 w-8 ${borderStyle(i)} border-black`}></div>
        ))}
      </button>
    </div>
  );
}

export default ColumnColor_OneColorX4;
