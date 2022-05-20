import React, { useEffect, useRef, useState } from "react";
import { useMutation } from "urql";

import { useBackgroundImgContext } from "../../context/backgroundImgContext";
import { useAuth } from "../../state/hooks/useAuth";

import {
  ChangeSettingsMutation,
  BackgroundImgMutation,
} from "../../graphql/graphqlMutations";

import { SettingsDatabase_i } from "../../../../schema/types/settingsType";
import { testUserId } from "../../state/data/testUserId";

interface Props {
  xsScreen: boolean;
  globalSettings: SettingsDatabase_i;
  backgroundImgResults: any;
  reexecuteBackgroundImg: any;
}

enum DbFileErrors {
  type = "Only .jpg and .png files are accepted",
  size = "File too large",
}

function BackgroundSettings_Upload({
  xsScreen,
  globalSettings,
  backgroundImgResults,
  reexecuteBackgroundImg,
}: Props): JSX.Element {
  const authContext = useAuth();

  const uiColor = globalSettings.uiColor;

  const [uploadFile, setUploadFile] = React.useState("");
  // const [uploadFile, setUploadFile] = React.useState<Blob>();
  // const [uploadFile, setUploadFile] = React.useState<Object>();

  const [changeSettingsResult, changeSettings] = useMutation<
    any,
    SettingsDatabase_i
  >(ChangeSettingsMutation);

  const [, changeBackgroundImg] = useMutation(BackgroundImgMutation);

  // const handleChange = React.useCallback(
  //   ({
  //     target: {
  //       validity,
  //       files: [file]
  //     }
  //   }) => validity.valid && changeBackgroundImg({ file }),
  //   [changeBackgroundImg]
  // );

  useEffect( () => {
    
    if(backgroundImgResults) {
      setUploadFile(backgroundImgResults.data.backgroundImg.backgroundImgUrl)
    }
  }, [backgroundImgResults])


  async function handleChange({
    target: {
      // @ts-ignore
      validity,
      // @ts-ignore
      files: [file],
    },
  }) {
    if (validity.valid) {
     await changeBackgroundImg({ file });
    reexecuteBackgroundImg({ requestPolicy: "network-only" });
    }
  }

  const [dbFilesError, setDbFilesError] = useState<null | string>(null);

  // let uploadFileName;
  // @ts-ignore
  // if (uploadFile) uploadFileName = uploadFile.name;

  const hiddenFileInput = useRef<HTMLInputElement>(null);

  // let keyForUseReactQuery = useBackgroundImgContext().currentBackgroundImg;
  let setCurrentBackgroundImgKey =
    useBackgroundImgContext().updateCurrentBackgroundImgKey;

  // async function submitForm(event: any) {
  //   event.preventDefault();

  //   console.log("uploadFile garphql try");

  //   console.log("typeof uploadFile");
  //   console.log(typeof uploadFile);
  //   console.log(uploadFile);

  //   changeBackgroundImg(uploadFile as Blob);

  //   // let dataArray = new FormData();
  //   // // dataArray.append("uploadFile", uploadFile as Blob);
  //   // dataArray.append("backgroundImg", uploadFile as Blob);

  //   // let testOrUserId: string;

  //   // authContext.authenticatedUserId && authContext.isAuthenticated
  //   //   ? (testOrUserId = authContext.authenticatedUserId)
  //   //   : (testOrUserId = testUserId);

  //   // await fetch(`http://localhost:4000/background_img/${testOrUserId}`, {
  //   //   method: "POST",
  //   //   /*  headers: {
  //   //     "Content-Type": "multipart/form-data",
  //   //   }, */
  //   //   body: dataArray,
  //   // })
  //   //   .then((res) => res.json())
  //   //   .then((response) => {
  //   //     // console.log(response.error);
  //   //     let errMsg = response.error;

  //   //     if (errMsg) {
  //   //       if (errMsg === DbFileErrors.size) {
  //   //         setDbFilesError("Please upload a file smaller than 10MB");
  //   //       }

  //   //       if (errMsg === DbFileErrors.type) {
  //   //         setDbFilesError(errMsg);
  //   //       }

  //   //       return;
  //   //     }

  //   //     setDbFilesError(null);

  //   //     changeSettings({
  //   //       ...globalSettings,
  //   //       defaultImage: "customBackground",
  //   //     });
  //   //     setCurrentBackgroundImgKey(Date.now().toString());
  //   //   })
  //   //   .catch((error) => {
  //   //     console.log(error);
  //   //   });

  //   // reexecuteBackgroundImg({ requestPolicy: "network-only" });

  // }

  return (
    <div>
      {/* {dbFilesError ? <p>{dbFilesError}</p> : <p className="invisible"></p>} */}
      {/* {dbFilesError ? <p>{dbFilesError}</p> : <p className="invisible"></p>} */}
      {/* <p className={ dbFilesError ? "invisible" : "visible" }>{dbFilesError}</p> */}
      <div className="h-6 mt-0.5 mb-1 text-red-600 text-center text-sm">
        {dbFilesError}
      </div>
      <form
        // onSubmit={submitForm}
        className={`flex justify-start items-center ${
          globalSettings.picBackground ? "" : "hidden"
        }`}
      >
        <button
          className={`border border-${uiColor} rounded-md px-1 pb-px mr-1 hover:bg-${uiColor} hover:bg-opacity-50 transition-colors duration-150
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
            // xsScreen ? "w-32" : "w-44"
            xsScreen ? "w-60" : "w-72"
          } border border-gray-300 align-text-bottom`}
          style={{ height: "26px" }}
        >
          {/* <p className="overflow-hidden whitespace-nowrap">{uploadFileName}</p> */}
          <p className="overflow-hidden overflow-ellipsis whitespace-nowrap">{uploadFile}</p>
        </div>
        <input
          type="file"
          name="file"
          // accept="image/x-png,image/jpeg,image/gif"
          /*     className={`bg-blueGray-50 h-6 ${
              xsScreen ? "w-48" : "w-60"
            } border border-gray-300`} */
          // onChange={(e: any) => {
          //   setUploadFile(e.target.files[0]);
          //   console.log(e.target.files[0]);
          // }}
          required
          // @ts-ignore
          onChange={handleChange}
          style={{ display: "none" }}
          ref={hiddenFileInput}
        />
        {/* <button
          type="submit"
          style={{ height: "26px" }}
          className={`border border-${uiColor} rounded-md px-1 pb-px hover:bg-${uiColor} hover:bg-opacity-50 transition-colors duration-150
                  focus:outline-none focus-visible:ring-1 ring-${uiColor}`}
          onClick={() => {
            console.log("click");
          }}
        >
          {" "}
          Upload image
        </button> */}
      </form>
    </div>
  );
}

export default BackgroundSettings_Upload;
