import React, { useRef } from "react";
import { useMutation } from "urql";

import { useBackgroundImgContext } from "../../context/backgroundImgContext";

import { ChangeSettingsMutation } from "../../graphql/graphqlMutations";

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

  const [changeSettingsResult, changeSettings] = useMutation<any, SettingsDatabase_i>(
    ChangeSettingsMutation
  );

  let uploadFileName;
  // @ts-ignore
  if (uploadFile) uploadFileName = uploadFile.name;

  const hiddenFileInput = useRef<HTMLInputElement>(null);

  // let keyForUseReactQuery = useBackgroundImgContext().currentBackgroundImg;
  let setCurrentBackgroundImgKey =
    useBackgroundImgContext().updateCurrentBackgroundImgKey;

  function submitForm(event: any) {
    event.preventDefault();

    let dataArray = new FormData();
    // dataArray.append("uploadFile", uploadFile as Blob);
    dataArray.append("backgroundImg", uploadFile as Blob);

    fetch("http://localhost:4000/background_img/", {
      method: "POST",
      /*  headers: {
        "Content-Type": "multipart/form-data",
      }, */
      body: dataArray,
    })
      .then((response) => {
        console.log(response);
        changeSettings({
          ...globalSettings,
          defaultImage: "customBackground",
        });
        setCurrentBackgroundImgKey(Date.now().toString());
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
      
        <button
          className={`border border-${uiColor} rounded-md px-1 pb-px hover:bg-${uiColor} hover:bg-opacity-50 transition-colors duration-150
        focus:outline-none focus-visible:ring-1 ring-${uiColor}`}
          style={{ height: "26px" }}
          onClick={(e) => {
            e.preventDefault();
            console.log("click");
            hiddenFileInput.current?.click();
          }}
        >
          Browse...
        </button>
        <div
          className={`bg-blueGray-50 pl-px ${
            xsScreen ? "w-32" : "w-44"
          } border border-gray-300 align-text-bottom`}
          style={{ height: "26px" }}
        >
          <p className="overflow-hidden">{uploadFileName}</p>
        </div>

        <input
          type="file"
          name="file"
          // accept="image/x-png,image/jpeg,image/gif"
          /*     className={`bg-blueGray-50 h-6 ${
            xsScreen ? "w-48" : "w-60"
          } border border-gray-300`} */
          onChange={(e: any) => {
            setUploadFile(e.target.files[0]);
            console.log(e.target.files[0]);
          }}
          style={{ display: "none" }}
          ref={hiddenFileInput}
        />
 

      <button
        type="submit"
        style={{ height: "26px" }}
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
