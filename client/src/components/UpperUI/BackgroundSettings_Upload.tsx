import React from "react";
import { SettingsDatabase_i } from "../../../../schema/types/settingsType";

interface Props {
  xsScreen: boolean;
  globalSettings: SettingsDatabase_i;
}

function BackgroundSettings_Upload({
  xsScreen,
  globalSettings,
}: Props): JSX.Element {
  const uiColor = globalSettings.uiColor;

  const [uploadFile, setUploadFile] = React.useState<Blob>();

  function submitForm(event: any) {
    event.preventDefault();

    let dataArray = new FormData();
    dataArray.append("uploadFile", uploadFile as Blob);

    fetch("url", {
      method: "POST",
      headers: {
        "Content-Type": "multipart/form-data",
      },
      body: dataArray,
    })
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  return (
    <form
      onSubmit={submitForm}
      className={`flex justify-between items-center ${
        globalSettings.picBackground ? "" : "hidden"
      }`}
    >
      <input
        type="file"
        className={`bg-blueGray-50 h-6 ${
          xsScreen ? "w-48" : "w-60"
        } border border-gray-300`}
        onChange={(e: any) => setUploadFile(e.target.files)}
      />
      <br />
      <button
        type="submit"
        className={`border border-${uiColor} rounded-md px-1 pb-px hover:bg-${uiColor} hover:bg-opacity-50 transition-colors duration-150
                focus:outline-none focus-visible:ring-1 ring-${uiColor}`}
      >
        {" "}
        Upload image
      </button>
    </form>
  );
}

export default BackgroundSettings_Upload;
