import React from "react";

// import shallow from "zustand/shallow";

// import { useGlobalSettings } from "../../state/hooks/defaultSettingsHooks";

import { SettingsDatabase_i } from "../../../../schema/types/settingsType";
import { UseGlobalSettingsAll } from "../../state/hooks/defaultSettingsHooks";

interface Props {
  title: string;
  link: string;
  pubDate: string;
  description: string;
  descriptionVis: boolean | null | undefined;
  dateVis: boolean | null | undefined;
  isTabDraggedOver: boolean;
  globalSettings: SettingsDatabase_i | UseGlobalSettingsAll;
}

function SingeRssNews({
  title,
  link,
  pubDate,
  description,
  descriptionVis,
  dateVis,
  isTabDraggedOver,
  globalSettings,
}: Props): JSX.Element {
  // const globalSettings = useGlobalSettings((state) => state, shallow);

  function renderDescription(descripion: string) {
    if (!description) {
      return "short description unavailable";
    }

    let descriptionSplitted = descripion.split(" ");

    let newArr: string[] = [];

    for (let i = 0; i < 25; i++) {
      newArr.push(descriptionSplitted[i]);
    }

    return newArr.join(" ") + "...";
  }

  return (
    <div
      className={`${isTabDraggedOver ? "bg-gray-200" : "bg-gray-50"} py-1 px-2
    border border-t-0
    ${globalSettings.picBackground ? "" : "border-black border-opacity-10"}
     `}
    >
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className="hover:underline text-sky-700 focus-1"
      >
        {title}
      </a>
      <p className="text-sm mt-0.5 leading-snug">
        {descriptionVis && renderDescription(description)}
      </p>
      <p className="text-xs mt-0.5 text-gray-700">{dateVis && pubDate}</p>
    </div>
  );
}

export default SingeRssNews;
