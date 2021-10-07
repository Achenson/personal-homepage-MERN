import React, { useState } from "react";

// import shallow from "zustand/shallow";
import { useQuery } from "urql";

import ColumnColor from "./ColumnColor";
import ColorsToChoose_DefaultAndColumns from "../Colors/ColorsToChoose_DefaultAndColumns";
import BackgroundColor from "./BackgroundColor";
import Reset from "./Reset";
import ColumnColor_OneColorX4 from "./ColumnColor_OneColorX4";

// import { useGlobalSettings } from "../../state/hooks/defaultSettingsHooks";
import { useTabs } from "../../state/hooks/useTabs";
import { useUpperUiContext } from "../../context/upperUiContext";

import { SettingsQuery } from "../../graphql/graphqlQueries";
import { testUserId } from "../../state/data/testUserId";

import { SettingsDatabase_i } from "../../../../schema/types/settingsType";

function UpperLeftMenu(): JSX.Element {
  // const globalSettings = useGlobalSettings((state) => state, shallow);

  const [defaultColorsFor, setDefaultColorsFor] = useState<
    "column_1" | "column_2" | "column_3" | "column_4" | "unselected"
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

  const [settingsResults] = useQuery({
    query: SettingsQuery,
    variables: { userId: testUserId },
  });

  const { data, fetching, error } = settingsResults;

  if (fetching) return <p>Loading...</p>;
  if (error) return <p>Oh no... {error.message}</p>;

  let globalSettings: SettingsDatabase_i = data.settings;

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
