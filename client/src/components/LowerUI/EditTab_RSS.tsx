import React from "react";

import shallow from "zustand/shallow";

// import { useRssSettings } from "../../state/hooks/defaultSettingsHooks";
// import { useGlobalSettings } from "../../state/hooks/defaultSettingsHooks";

import { useTabs } from "../../state/hooks/useTabs";

import { SettingsDatabase_i } from "../../../../schema/types/settingsType";

import { UseGlobalSettingsAll } from "../../state/hooks/defaultSettingsHooks";

interface Props {
  setWasAnythingClicked: React.Dispatch<React.SetStateAction<boolean>>;
  descriptionCheckbox: boolean;
  setDescriptionCheckbox: React.Dispatch<React.SetStateAction<boolean>>;
  dateCheckbox: boolean;
  setDateCheckbox: React.Dispatch<React.SetStateAction<boolean>>;
  setWasCheckboxClicked: React.Dispatch<React.SetStateAction<boolean>>;
  rssItemsPerPage: number;
  setRssItemsPerPage: React.Dispatch<React.SetStateAction<number>>;
  setWasItemsPerPageClicked: React.Dispatch<React.SetStateAction<boolean>>;
  tabID: string;
  rssLinkInput: string;
  setRssLinkInput: React.Dispatch<React.SetStateAction<string>>;
  globalSettings: SettingsDatabase_i | UseGlobalSettingsAll;
}

function EditTab_RSS({
  setWasAnythingClicked,
  descriptionCheckbox,
  setDescriptionCheckbox,
  dateCheckbox,
  setDateCheckbox,
  setWasCheckboxClicked,
  rssItemsPerPage,
  setRssItemsPerPage,
  setWasItemsPerPageClicked,
  tabID,
  rssLinkInput,
  setRssLinkInput,
  globalSettings
}: Props): JSX.Element {
  // const rssSettingsState = useRssSettings((state) => state, shallow);
  // const globalSettings = useGlobalSettings((state) => state, shallow);
  const resetTabRssSettings = useTabs((state) => state.resetTabRssSettings);

  return (
    <div className="-mb-1">
      <div className="flex items-center mt-2 justify-between">
        <p className="whitespace-nowrap flex-none" style={{ width: "65px" }}>
          RSS link
        </p>
        <input
          type="text"
          // min-w-0 !!
          className="border w-full max-w-6xl pl-px focus-1"
          value={rssLinkInput}
          onChange={(e) => {
            setRssLinkInput(e.target.value);
            setWasAnythingClicked(true);
          }}
        />
      </div>
      <div className="flex items-center mb-2 mt-2 justify-between">
        <p className="whitespace-nowrap w-32">Display</p>
        <div className="flex">
          <div className="flex items-center mr-2">
            <button
              style={{ marginTop: "2px" }}
              className="focus-1-offset-dark"
              onClick={() => {
                setDescriptionCheckbox((b) => !b);
                setWasCheckboxClicked(true);
              }}
              aria-label={"RSS description on"}
            >
              <div
                className={`h-3 w-3 cursor-pointer transition duration-75 border-2 border-blueGray-400 ${
                  descriptionCheckbox
                    ? `bg-blueGray-400 bg-opacity-50 hover:border-opacity-30`
                    : `hover:border-opacity-50`
                } `}
              ></div>
            </button>

            <span className="ml-1">Description</span>
          </div>

          <div className="flex items-center">
            <button
              style={{ marginTop: "2px" }}
              className="focus-1-offset-dark"
              onClick={() => {
                setDateCheckbox((b) => !b);
                setWasCheckboxClicked(true);
              }}
              aria-label={"RSS date on"}
            >
              <div
                className={`h-3 w-3 cursor-pointer transition duration-75 border-2 border-blueGray-400 ${
                  dateCheckbox
                    ? `bg-blueGray-400 bg-opacity-50 hover:border-opacity-30`
                    : `hover:border-opacity-50`
                } `}
              ></div>
            </button>

            <span className="ml-1">Date</span>
          </div>
        </div>
      </div>
      <div className="flex items-center mt-2 justify-between">
        <p className="whitespace-nowrap w-32">Items per page</p>
        <input
          type="number"
          min="5"
          max="15"
          className="border w-8 text-center border-gray-300 focus-1"
          value={rssItemsPerPage}
          onWheel={(event) => event.currentTarget.blur()}
          onChange={(e) => {
            setRssItemsPerPage(parseInt(e.target.value));
            setWasItemsPerPageClicked(true);
          }}
        />
      </div>
      <p className="text-center mt-1">
        {" "}
        <span
          className="text-red-600 hover:underline cursor-pointer"
          onClick={() => {
            // setResetColorsData(true);
            setDescriptionCheckbox(globalSettings.description);
            setDateCheckbox(globalSettings.date);
            setRssItemsPerPage(globalSettings.itemsPerPage);

            setWasAnythingClicked(true);
            setWasCheckboxClicked(true);
            setWasItemsPerPageClicked(true);

            resetTabRssSettings(tabID);
          }}
        >
          RESET
        </span>{" "}
        to default
      </p>
    </div>
  );
}

export default EditTab_RSS;
