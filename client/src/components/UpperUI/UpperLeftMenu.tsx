import React, { useState } from "react";
// import shallow from "zustand/shallow";

import ColumnColor from "./ColumnColor";
import ColorsToChoose_DefaultAndColumns from "../Colors/ColorsToChoose_DefaultAndColumns";
import BackgroundColor from "./BackgroundColor";
import Reset from "./Reset";
import ColumnColor_OneColorX4 from "./ColumnColor_OneColorX4";

// import { useGlobalSettings } from "../../state/hooks/defaultSettingsHooks";
import { useTabs } from "../../state/hooks/useTabs";
import { useUpperUiContext } from "../../context/upperUiContext";

import { SettingsDatabase_i } from "../../../../schema/types/settingsType";

interface Props {
  globalSettings: SettingsDatabase_i;
}

function UpperLeftMenu({ globalSettings }: Props): JSX.Element {
  // const globalSettings = useGlobalSettings((state) => state, shallow);

  const [defaultColorsFor, setDefaultColorsFor] = useState<
    "colColor_1" | "colColor_2" | "colColor_3" | "colColor_4" | "unselected"
  >("unselected");

  const [isHoverOnAnyColumn, setIsHoverOnAnyColumn] = useState(false);

  const setFocusedTabState = useTabs((state) => state.setFocusedTabState);

  const upperUiContext = useUpperUiContext();

  // set focus on current column Color when pressing "Escape" for closing ColorsToChoose
  // to avoid problem with unexpected tabIndex behaviour after closing ColorsToChoose
  const [focusOnColumnColor, setFocusOnColumnColor] = useState<
    null | 1 | 2 | 3 | 4
  >(null);

  // set focus on BackgroundColor SVG when pressing "Escape" for closing ColorsToChoose_Background
  const [focusOnBackgroundColor, setFocusOnBackgroundColor] = useState(false);

  function columnsRendering(howMany: number, oneColorForAllCols: boolean) {
    let arrOfColumns = [];
    for (let i = 1; i <= howMany; i++) {
      arrOfColumns.push(i);
    }

    return arrOfColumns.map((el, index) => {
      return (
        <ColumnColor
          colNumber={oneColorForAllCols ? 1 : el}
          defaultColorsFor={defaultColorsFor}
          setDefaultColorsFor={setDefaultColorsFor}
          key={index}
          arrIndex={index}
          isHoverOnAnyColumn={isHoverOnAnyColumn}
          tabIndex={index + 1}
          focusOnColumnColor={focusOnColumnColor}
          setFocusOnColumnColor={setFocusOnColumnColor}
          globalSettings={globalSettings}
        />
      );
    });
  }

  return (
    <div
      className="flex relative items-center justify-between"
      onFocus={() => {
        setFocusedTabState(null);
      }}
    >
      <div className="flex relative justify-between items-center mb-2 mt-2">
        {globalSettings.oneColorForAllCols ? (
          <ColumnColor_OneColorX4
            setDefaultColorsFor={setDefaultColorsFor}
            focusOnColumnColor={focusOnColumnColor}
            setFocusOnColumnColor={setFocusOnColumnColor}
            globalSettings={globalSettings}
          />
        ) : (
          <div
            className="flex bg-white bg-opacity-80"
            onMouseEnter={() => {
              if (globalSettings.oneColorForAllCols) {
                setIsHoverOnAnyColumn(true);
              }
            }}
            onMouseLeave={() => {
              if (globalSettings.oneColorForAllCols) {
                setIsHoverOnAnyColumn(false);
              }
            }}
          >
            {columnsRendering(4, globalSettings.oneColorForAllCols)}
          </div>
        )}
      </div>
      <div className="flex justify-between w-16 ml-2">
        {globalSettings.picBackground ? null : (
          <BackgroundColor
            focusOnBackgroundColor={focusOnBackgroundColor}
            setFocusOnBackgroundColor={setFocusOnBackgroundColor}
            globalSettings={globalSettings}
          />
        )}
        <Reset
          setFocusOnBackgroundColor={setFocusOnBackgroundColor}
          setFocusOnColumnColor={setFocusOnColumnColor}
          globalSettings={globalSettings}
        />
      </div>
      <div>
        {upperUiContext.upperVisState.colorsColumnVis && (
          <div className="absolute left-0 bottom-32">
            <ColorsToChoose_DefaultAndColumns
              defaultColorsFor={defaultColorsFor}
              setFocusOnColumnColor={setFocusOnColumnColor}
              globalSettings={globalSettings}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default UpperLeftMenu;
