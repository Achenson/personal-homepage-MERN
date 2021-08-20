import React, { useEffect, useRef } from "react";

import { useUpperUiContext } from "../../context/upperUiContext";

import shallow from "zustand/shallow";
import { useGlobalSettings } from "../../state/hooks/defaultSettingsHooks";
import {
  useColumnsColors,
  useColumnsColorsImg,
} from "../../state/hooks/colorHooks";
import { useTabs } from "../../state/hooks/useTabs";

interface Props {
  colNumber: number;
  defaultColorsFor:
    | "column_1"
    | "column_2"
    | "column_3"
    | "column_4"
    | "unselected";
  setDefaultColorsFor: React.Dispatch<
    React.SetStateAction<
      "column_1" | "column_2" | "column_3" | "column_4" | "unselected"
    >
  >;
  arrIndex: number;
  isHoverOnAnyColumn: boolean;
  tabIndex: number;
  focusOnColumnColor: null | 1 | 2 | 3 | 4;
  setFocusOnColumnColor: React.Dispatch<
    React.SetStateAction<null | 1 | 2 | 3 | 4>
  >;
}

function ColumnColor({
  colNumber,
  setDefaultColorsFor,
  arrIndex,
  isHoverOnAnyColumn,
  tabIndex,
  focusOnColumnColor,
  setFocusOnColumnColor,
}: Props): JSX.Element {
  const globalSettings = useGlobalSettings((state) => state, shallow);

  const columnsColors = useColumnsColors((state) => state, shallow);
  const columnsColorsImg = useColumnsColorsImg((state) => state, shallow);

  const setTabOpenedState = useTabs((state) => state.setTabOpenedState);

  const upperUiContext = useUpperUiContext();

  let focusOnColumnColor_ref = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (
      focusOnColumnColor_ref.current !== null &&
      focusOnColumnColor === colNumber
    ) {
      focusOnColumnColor_ref.current.focus();
      setFocusOnColumnColor(null);
    }
  }, [focusOnColumnColor, setFocusOnColumnColor, colNumber]);

  function makeColumnsColor(colNumber: number) {
    if (!globalSettings.picBackground) {
      switch (colNumber) {
        case 1:
          return "bg-" + columnsColors.column_1;
        case 2:
          return "bg-" + columnsColors.column_2;
        case 3:
          return "bg-" + columnsColors.column_3;
        case 4:
          return "bg-" + columnsColors.column_4;
        default:
          return columnsColors.column_1;
      }
    }

    switch (colNumber) {
      case 1:
        return columnsColorsImg.column_1;
      case 2:
        return columnsColorsImg.column_2;
      case 3:
        return columnsColorsImg.column_3;
      case 4:
        return columnsColorsImg.column_4;
      default:
        return columnsColorsImg.column_1;
    }
  }

  function borderStyle() {
    // unselected column
    if (upperUiContext.upperVisState.columnSelected !== colNumber) {
      if (arrIndex > 0) {
        return "border border-l-0";
      }
      return "border";
    }

    // selected column (or all columns if oneColorForAllCols is true)
    if (arrIndex > 0) {
      return `border border-t-2 border-b-2 border-r-2 ${
        globalSettings.oneColorForAllCols ? "border-l-0" : ""
      }`;
    }
    return "border-2";
  }

  return (
    <>
      {arrIndex + 1 <= globalSettings.numberOfCols ? (
        <button
          ref={focusOnColumnColor_ref}
          onClick={() => {
            setDefaultColorsFor(`column_${colNumber}` as any);
            setTabOpenedState(null);

            if (upperUiContext.upperVisState.columnSelected === colNumber) {
              upperUiContext.upperVisDispatch({ type: "COLORS_COLUMN_TOGGLE" });
            } else {
              upperUiContext.upperVisDispatch({
                type: "COLORS_COLUMN_OPEN",
                payload: colNumber,
              });
            }
          }}
          className={`relative overflow-hidden h-4 w-8 ${
            !globalSettings.picBackground ? makeColumnsColor(colNumber) : ""
          }
          ${isHoverOnAnyColumn ? "shadow-inner_lg" : ""}
          cursor-pointer ${borderStyle()} border-black hover:shadow-inner_lg
          focus:outline-none focus-visible:ring-2   ${
            globalSettings.picBackground
              ? " ring-blueGray-600 "
              : "ring-blueGray-500"
          } ring-inset
          `}
          style={{
            backgroundColor: `${
              globalSettings.picBackground ? makeColumnsColor(colNumber) : ""
            }`,
          }}
          tabIndex={
            // only first ColumnColor focusable when oneColorForAllCols is on
            !globalSettings.oneColorForAllCols
              ? tabIndex
              : tabIndex === 1
              ? 1
              : -1
          }
          aria-label={"Column color menu"}
        ></button>
      ) : null}
    </>
  );
}

export default ColumnColor;
