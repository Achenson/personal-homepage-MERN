import React from "react";

import { useBackgroundColor } from "../../state/hooks/colorHooks";

import { backgroundColorsLightFocus } from "../../utils/data/colors_background";

interface Props {
  color: string;
  colorCol: number;
  selectedNumber: number;
  colorNumber: number;
  setSelectedNumber: React.Dispatch<React.SetStateAction<number>>;
  colorArrLength: number;
}

function SingleColor_Background({
  color,
  colorCol,
  selectedNumber,
  colorNumber,
  setSelectedNumber,
  colorArrLength,
}: Props): JSX.Element {
  const setBackgroundColor = useBackgroundColor(
    (state) => state.setBackgroundColor
  );

  function borderMaker() {
    if (colorNumber !== selectedNumber) {
      return "border border-black";
    }

    return `border-2 z-20 ${
      [6, 7, 8, 9].indexOf(colorCol) > -1 ? "border-gray-100" : "border-black"
    }`;
  }

  function focusColor(): string {
    if (backgroundColorsLightFocus.indexOf(color) > -1) {
      return "gray-400";
    }
    return "gray-500";
  }

  let tabIndex = calcTabIndex();

  function calcTabIndex() {
    let indexToReturn = colorNumber - selectedNumber + 1;

    if (indexToReturn >= 1) {
      return indexToReturn;
    }

    return colorArrLength - selectedNumber + colorNumber + 1;
  }

  return (
    <button
      className={`h-4 w-4 -mr-px -mt-px bg-${color} cursor-pointer
      ${borderMaker()}
      hover:border-2 hover:border-gray-500 hover:z-50 
      focus:outline-none focus-visible:ring-2 ring-${focusColor()} ring-inset
      `}
      onClick={() => {
        setBackgroundColor(color);
        setSelectedNumber(colorNumber);
      }}
      tabIndex={tabIndex}
      aria-label={"Choose color"}
    ></button>
  );
}

export default SingleColor_Background;
