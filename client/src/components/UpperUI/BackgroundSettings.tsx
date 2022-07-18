import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

// import shallow from "zustand/shallow";
import FocusLock from "react-focus-lock";
import { useQuery, useMutation } from "urql";

import Settings_inner_xs from "./Settings_inner_xs";
import { ReactComponent as CancelSVG } from "../../svgs/alphabet-x.svg";

import {
  useGlobalSettings,
  UseGlobalSettingsAll,
} from "../../state/hooks/defaultSettingsHooks";
// import { useDefaultColors } from "../../state/hooks/colorHooks";
import { useUpperUiContext } from "../../context/upperUiContext";

import { useWindowSize } from "../../utils/funcs and hooks/useWindowSize";
import { handleKeyDown_upperUiSetting } from "../../utils/funcs and hooks/handleKeyDown_upperUiSettings";
import { ChangeSettingsMutation } from "../../graphql/graphqlMutations";

import { SettingsDatabase_i } from "../../../../schema/types/settingsType";
import BackgroundSettings_Upload from "./BackgroundSettings_Upload";

interface Props {
  mainPaddingRight: boolean;
  scrollbarWidth: number;
  globalSettings: SettingsDatabase_i | UseGlobalSettingsAll;
  backgroundImgResults: any;
  reexecuteBackgroundImg: any;
  userIdOrNoId: string | null;
}

function BackgroundSettings({
  mainPaddingRight,
  scrollbarWidth,
  globalSettings,
  backgroundImgResults,
  reexecuteBackgroundImg,
  userIdOrNoId,
}: Props): JSX.Element {
  const navigate = useNavigate();
  // const globalSettings = useGlobalSettings((state) => state, shallow);
  const setGlobalSettings = useGlobalSettings(
    (state) => state.setGlobalSettings
  );
  // const uiColor = useDefaultColors((state) => state.uiColor);
  const uiColor = globalSettings.uiColor;

  const upperUiContext = useUpperUiContext();

  const windowSize = useWindowSize();
  const [xsScreen, setXsScreen] = useState(
    () => upperUiContext.upperVisState.xsSizing_initial
  );

  const [wasCustomClicked, setWasCustomClicked] = useState(false);

  const hiddenFileInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (windowSize.width) {
      if (windowSize.width < 505) {
        setXsScreen(true);
      } else {
        setXsScreen(false);
      }
    }
  }, [windowSize.width]);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  });

  const [changeSettingsResult, changeSettings] = useMutation<
    any,
    SettingsDatabase_i
  >(ChangeSettingsMutation);

  // let globalSettings: SettingsDatabase_i = data.settings;

  function handleKeyDown(event: KeyboardEvent) {
    handleKeyDown_upperUiSetting(event.code, upperUiContext, 5);
  }

  let finalColorForImgBackgroundMode = uiColor;

  if (uiColor === "blueGray-400") {
    finalColorForImgBackgroundMode = "blueGray-700";
  }

  const imgDescription_1 = "Transparent colors for columns";
  const imgDescription_2a = "Use ";
  const imgDescription_2b = " or choose default:";
  const imgDescription_3 = "Choose default image:";
  // const imgDescription_2 = "Upload background image or use default:";
  const noImgDescription = "Full colors for background and columns";

  const renderChoseImage = (userIdOrNoId: string | null) => {
    if (!userIdOrNoId) {
      return <p className="block xs:inline-block">{imgDescription_3}</p>;
    }

    return (
      <p className="block xs:inline-block">
        {imgDescription_2a}
        <button
          onClick={() => {
            /*   setGlobalSettings({
          ...globalSettings,
          defaultImage: "defaultBackground",
        }); */

            if (!userIdOrNoId) {
              console.log("authentication needed to access custom");
              return;
            }

            if (!backgroundImgResults?.data?.backgroundImg?.backgroundImgUrl) {
              console.log("no BACKGROUND IMG RESULTS");

              hiddenFileInput.current?.click();
              return;
            }

            console.log("BACKGROUND IMG RESULTS exist");
            console.log(backgroundImgResults);

            if (!wasCustomClicked) {
              setWasCustomClicked(true);
            }

            changeSettings({
              ...(globalSettings as SettingsDatabase_i),
              defaultImage: "customBackground",
            });
          }}
          className="focus-1-offset"
          aria-label={"Default Background image"}
        >
          <span className={`text-${uiColor} cursor-pointer hover:underline`}>
            custom image
          </span>
        </button>
        {imgDescription_2b}
      </p>
    );
  };

  const renderBrowseFiles = (
    userIdOrNoId: string | null,
    picBackground: boolean
  ) => {
    if (userIdOrNoId) {
      return (
        <BackgroundSettings_Upload
          xsScreen={xsScreen}
          globalSettings={globalSettings}
          backgroundImgResults={backgroundImgResults}
          reexecuteBackgroundImg={reexecuteBackgroundImg}
          wasCustomClicked={wasCustomClicked}
          setWasCustomClicked={setWasCustomClicked}
          hiddenFileInput={hiddenFileInput}
        />
      );
    } else {
      if (!picBackground) {
        return null;
      }

      return (
        <p className="text-center">
          <button
            onClick={() => {
              navigate("/login-register");
            }}
            className="focus-1-offset"
            aria-label={"Authenticate"}
          >
            <span className={`text-${uiColor} cursor-pointer hover:underline`}>
              Authenticate
            </span>
          </button>
          <span> </span>
          to upload custom images
        </p>
      );
    }
  };

  return (
    <FocusLock>
      <div
        className="flex flex-col z-50 fixed h-full w-screen justify-center items-center"
        style={{ backgroundColor: "rgba(90, 90, 90, 0.4)" }}
        onClick={() => {
          upperUiContext.upperVisDispatch({
            type: "BACKGROUND_SETTINGS_TOGGLE",
          });
        }}
      >
        <div
          className="md:mb-40 relative"
          onClick={(e) => {
            e.stopPropagation();
            return;
          }}
        >
          <div
            className={`bg-gray-100 pb-3 pt-5 border-2 px-4 border-${uiColor} rounded-sm relative`}
            style={{
              width: `${xsScreen ? "350px" : "417px"}`,
              // height: `${xsScreen ? "238px" : "205px"}`,
              height: `${xsScreen ? "258px" : "225px"}`,
              marginLeft: `${
                mainPaddingRight && scrollbarWidth >= 10
                  ? `-${scrollbarWidth - 1}px`
                  : ""
              }`,
            }}
          >
            <Settings_inner_xs
              currentSettings={"background"}
              globalSettings={globalSettings}
            />
            <div className="absolute right-0 top-0 mt-1 mr-1">
              <button
                className="h-5 w-5 focus-2-offset-dark"
                onClick={() => {
                  upperUiContext.upperVisDispatch({
                    type: "BACKGROUND_SETTINGS_TOGGLE",
                  });
                  upperUiContext.upperVisDispatch({
                    type: "FOCUS_ON_UPPER_RIGHT_UI",
                    payload: 5,
                  });
                }}
                aria-label={"Close"}
              >
                <CancelSVG className="h-full w-full fill-current text-gray-600 cursor-pointer hover:text-gray-900" />
              </button>
            </div>

            <div className="mx-0 xs:mx-2">
              <p className="text-center mb-3">Background mode</p>
              <div className="mb-3 text-center">
                <span className="text-lg">Background image:</span>
                <button
                  className="ml-2 focus-1-offset"
                  onClick={() => {
                    if (!globalSettings.picBackground) {
                      /* setGlobalSettings({
                        ...globalSettings,
                        picBackground: true,
                      }); */

                      if (userIdOrNoId) {
                        changeSettings({
                          ...(globalSettings as SettingsDatabase_i),
                          picBackground: true,
                        });
                      } else {
                        setGlobalSettings({
                          ...(globalSettings as UseGlobalSettingsAll),
                          picBackground: true,
                        });
                      }

                      // changeSettings({
                      //   ...globalSettings,
                      //   picBackground: true,
                      // });
                    }
                  }}
                  aria-label={"Background image on"}
                >
                  <span
                    className={`${
                      globalSettings.picBackground
                        ? "cursor-default" +
                          " " +
                          "text-" +
                          finalColorForImgBackgroundMode
                        : "hover:text-opacity-50 cursor-pointer text-gray-400"
                    } text-lg`}
                  >
                    ON
                  </span>
                </button>
                <button
                  className="ml-1.5 focus-1-offset"
                  onClick={() => {
                    if (globalSettings.picBackground) {
                      /*   setGlobalSettings({
                        ...globalSettings,
                        picBackground: false,
                      }); */

                      if (userIdOrNoId) {
                        changeSettings({
                          ...(globalSettings as SettingsDatabase_i),
                          picBackground: false,
                        });
                      } else {
                        setGlobalSettings({
                          ...(globalSettings as UseGlobalSettingsAll),
                          picBackground: false,
                        });
                      }

                      // changeSettings({
                      //   ...globalSettings,
                      //   picBackground: false,
                      // });
                    }
                  }}
                  aria-label={"Background image off"}
                >
                  <span
                    className={`${
                      globalSettings.picBackground
                        ? "hover:text-opacity-50 cursor-pointer text-gray-400"
                        : "cursor-default" +
                          " " +
                          "text-" +
                          finalColorForImgBackgroundMode
                    } text-lg`}
                  >
                    OFF
                  </span>
                </button>
              </div>

              {globalSettings.picBackground ? (
                <div className="text-center">
                  <p className={`mb-2 xs:mb-0`}>{imgDescription_1}</p>
                  <div className={`mb-0`}>
                    {renderChoseImage(userIdOrNoId)}
                    {/* INSERT HERE !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! */}

                    <span> </span>
                    <button
                      onClick={() => {
                        /*   setGlobalSettings({
                          ...globalSettings,
                          defaultImage: "defaultBackground",
                        }); */
                        if (wasCustomClicked) setWasCustomClicked(false);

                        if (userIdOrNoId) {
                          changeSettings({
                            ...(globalSettings as SettingsDatabase_i),
                            defaultImage: "defaultBackground",
                          });
                        } else {
                          setGlobalSettings({
                            ...(globalSettings as UseGlobalSettingsAll),
                            defaultImage: "defaultBackground",
                          });
                        }

                        // changeSettings({
                        //   ...globalSettings,
                        //   defaultImage: "defaultBackground",
                        // });
                      }}
                      className="focus-1-offset"
                      aria-label={"Background image one"}
                    >
                      <span
                        className={`text-${uiColor} cursor-pointer hover:underline`}
                      >
                        1
                      </span>
                    </button>

                    <span> </span>
                    <button
                      onClick={() => {
                        /*   setGlobalSettings({
                          ...globalSettings,
                          defaultImage: "defaultBackground_2",
                        }); */
                        if (wasCustomClicked) setWasCustomClicked(false);
                        // changeSettings({
                        //   ...globalSettings,
                        //   defaultImage: "defaultBackground_2",
                        // });

                        if (userIdOrNoId) {
                          changeSettings({
                            ...(globalSettings as SettingsDatabase_i),
                            defaultImage: "defaultBackground_2",
                          });
                        } else {
                          setGlobalSettings({
                            ...(globalSettings as UseGlobalSettingsAll),
                            defaultImage: "defaultBackground_2",
                          });
                        }
                      }}
                      className="focus-1-offset"
                      aria-label={"Background image two"}
                    >
                      <span
                        className={`text-${uiColor} cursor-pointer hover:underline`}
                      >
                        2
                      </span>
                    </button>

                    <span> </span>
                    <button
                      className="focus-1-offset"
                      onClick={() => {
                        /*   setGlobalSettings({
                          ...globalSettings,
                          defaultImage: "defaultBackground_3",
                        }); */
                        if (wasCustomClicked) setWasCustomClicked(false);

                        if (userIdOrNoId) {
                          changeSettings({
                            ...(globalSettings as SettingsDatabase_i),
                            defaultImage: "defaultBackground_3",
                          });
                        } else {
                          setGlobalSettings({
                            ...(globalSettings as UseGlobalSettingsAll),
                            defaultImage: "defaultBackground_3",
                          });
                        }

                        // changeSettings({
                        //   ...globalSettings,
                        //   defaultImage: "defaultBackground_3",
                        // });
                      }}
                      aria-label={"Background image three"}
                    >
                      <span
                        className={`text-${uiColor} cursor-pointer hover:underline`}
                      >
                        3
                      </span>
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-center mb-3">{noImgDescription}</p>
              )}

              {renderBrowseFiles(userIdOrNoId, globalSettings.picBackground)}

              {/* <div
                className={`flex justify-between items-center ${
                  globalSettings.picBackground ? "" : "hidden"
                }`}
              > */}

              {/* 
<BackgroundSettings_Upload
                  xsScreen={xsScreen}
                  globalSettings={globalSettings}
                  backgroundImgResults={backgroundImgResults}
                  reexecuteBackgroundImg={reexecuteBackgroundImg}
                  wasCustomClicked={wasCustomClicked}
                  setWasCustomClicked={setWasCustomClicked}
                  hiddenFileInput={hiddenFileInput}
                /> */}

              {/*       <div
                  className={`bg-blueGray-50 h-6 ${
                    xsScreen ? "w-48" : "w-60"
                  } border border-gray-300`}
                ></div>
                <button
                  className={`border border-${uiColor} rounded-md px-1 pb-px hover:bg-${uiColor} hover:bg-opacity-50 transition-colors duration-150
                focus:outline-none focus-visible:ring-1 ring-${uiColor}`}
                >
                  Upload image
                </button> */}
              {/* </div> */}
            </div>
          </div>
        </div>
      </div>
    </FocusLock>
  );
}

export default BackgroundSettings;
