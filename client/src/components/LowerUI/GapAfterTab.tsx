import React from "react";
import { useQuery, useMutation } from "urql";

import { useDrop } from "react-dnd";
// import shallow from "zustand/shallow";

// import { useGlobalSettings } from "../../state/hooks/defaultSettingsHooks";
import { useTabBeingDraggedColor } from "../../state/hooks/colorHooks";

import { ItemTypes } from "../../utils/data/itemsDnd";
import { useTabs } from "../../state/hooks/useTabs";
import { useDbContext } from "../../context/dbContext";

import { dragTabDb } from "../../utils/funcs and hooks/dragTabDb";
import { ChangeTabMutation } from "../../graphql/graphqlMutations";

import { SettingsDatabase_i } from "../../../../schema/types/settingsType";
import { TabDatabase_i } from "../../../../schema/types/tabType";

interface Item {
  type: string;
  tabID: string;
  colNumber: number;
  tabColor: string;
}

interface Props {
  colNumber: number;
  tabID_orNull: string | null;
  picBackground: boolean;
  isThisLastGap: boolean;
  // for proper top border display
  isThisTheOnlyGap: boolean;
  globalSettings: SettingsDatabase_i;
}

function GapAfterTab({
  colNumber,
  tabID_orNull,
  isThisLastGap,
  isThisTheOnlyGap,
  globalSettings,
}: Props): JSX.Element {
  // const globalSettings = useGlobalSettings((state) => state, shallow);
  const tabs = useDbContext().tabs;

  const [editTabResult, editTab] = useMutation<any, TabDatabase_i>(
    ChangeTabMutation
  );

  const tabBeingDraggedColor = useTabBeingDraggedColor(
    (state) => state.tabBeingDraggedColor
  );

  const dragTab = useTabs((store) => store.dragTab);

  const [{ isOver }, drop] = useDrop({
    //    required property
    accept: ItemTypes.BOOKMARK,
    drop: (item: Item, monitor) =>
      // dragTab(item.tabID, item.colNumber, colNumber, tabID_orNull, false),
      dragTabDb(
        item.tabID,
        item.colNumber,
        colNumber,
        tabID_orNull,
        false,
        tabs,
        editTab
      ),
    // drop: (item, monitor) => console.log(item.tabID),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  function calcOpacityOnDrop() {
    return `bg-${tabBeingDraggedColor} opacity-60`;
  }

  function upperLastGapBorderDrag(): string {
    if (isOver) {
      return calcOpacityOnDrop();
    }

    if (globalSettings.picBackground) {
      return "";
    }

    return `border-r border-l ${isThisTheOnlyGap ? "border-t" : ""}`;
  }

  return (
    <>
      {isThisLastGap ? (
        <div ref={drop} className="h-full relative flex flex-col">
          <div
            className={`h-6 ${
              globalSettings.picBackground
                ? ""
                : `border-black border-opacity-10 `
            }
            ${upperLastGapBorderDrag()} `}
          ></div>

          {/* 1px height to cover bottom of the column when draggind */}
          {!globalSettings.picBackground && (
            <div
              className={`absolute h-px w-full ${
                isOver ? calcOpacityOnDrop() : ""
              }`}
              style={{ top: "24px" }}
            ></div>
          )}

          <div
            className={`w-full flex-grow ${
              globalSettings.picBackground
                ? ""
                : `border-black border-opacity-10 border-l border-r border-b`
            }
            ${isOver ? "opacity-30 bg-blueGray-200" : ""}
          `}
            // style={{ height: "10000vh" }}
          ></div>
        </div>
      ) : (
        <div
          className={`h-6 ${
            globalSettings.picBackground
              ? ""
              : `border-black border-opacity-10 border-l border-r`
          } ${isOver ? calcOpacityOnDrop() : ""}
     
     `}
          ref={drop}
        ></div>
      )}
    </>
  );
}

export default GapAfterTab;
