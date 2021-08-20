import React, { useState, useEffect, useRef } from "react";

import FocusLock from "react-focus-lock";

import { ReactComponent as CancelSVG } from "../../svgs/alphabet-x.svg";

import Profile_input from "./Profile_input";

import { useLoggedInState } from "../../state/hooks/useLoggedInState";
import { useDefaultColors } from "../../state/hooks/colorHooks";
import { useUpperUiContext } from "../../context/upperUiContext";

import { handleKeyDown_upperUiSetting } from "../../utils/funcs and hooks/handleKeyDown_upperUiSettings";

interface Props {
  mainPaddingRight: boolean;
}

function Profile({ mainPaddingRight }: Props): JSX.Element {
  const uiColor = useDefaultColors((state) => state.uiColor);

  const [loginOrRegister, setLoginOrRegister] = useState<"login" | "register">(
    "login"
  );
  const loggedInState = useLoggedInState((state) => state.loggedInState);
  const setLoggedInState = useLoggedInState((state) => state.setLoggedInState);

  const upperUiContext = useUpperUiContext();

  let firstFieldRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (firstFieldRef.current !== null) {
      firstFieldRef.current.focus();
    }
  }, []);

  let finalColorForImgBackgroundMode = uiColor;

  if (uiColor === "blueGray-400") {
    finalColorForImgBackgroundMode = "blueGray-700";
  }

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  });

  function handleKeyDown(event: KeyboardEvent) {
    handleKeyDown_upperUiSetting(event.code, upperUiContext, 8);
  }

  return (
    <FocusLock>
      <div
        // justify-center changed to paddingTop so login & register are on the same height
        className="flex flex-col z-50 fixed h-full w-screen items-center"
        style={{ backgroundColor: "rgba(90, 90, 90, 0.4)", paddingTop: "30vh" }}
        onClick={() => {
          upperUiContext.upperVisDispatch({ type: "PROFILE_TOGGLE" });
        }}
      >
        <div
          className="relative"
          onClick={(e) => {
            e.stopPropagation();
            return;
          }}
        >
          <div
            className={`bg-gray-100 pb-3 pt-5 border-2 px-4 border-${uiColor} rounded-sm relative ${
              mainPaddingRight ? "-ml-4" : ""
            }`}
            style={{
              width: `350px`,
            }}
          >
            <div className="absolute right-0 top-0 mt-1 mr-1">
              <button
                className="h-5 w-5 focus-2-offset-dark"
                onClick={() => {
                  upperUiContext.upperVisDispatch({ type: "PROFILE_TOGGLE" });
                  upperUiContext.upperVisDispatch({
                    type: "FOCUS_ON_UPPER_RIGHT_UI",
                    payload: 8,
                  });
                }}
                aria-label={"Close"}
              >
                <CancelSVG className="h-5 w-5 fill-current text-gray-600 cursor-pointer hover:text-gray-900" />
              </button>
            </div>

            <div className="">
              <div className="mx-auto w-32 flex justify-between">
                <button
                  onClick={() => {
                    setLoginOrRegister("login");
                  }}
                  className={`${
                    loginOrRegister === "login"
                      ? "cursor-default" +
                        " " +
                        "text-" +
                        finalColorForImgBackgroundMode
                      : "hover:text-opacity-50 cursor-pointer text-gray-400"
                  } text-lg  focus-1-offset`}
                >
                  <span>Login</span>
                </button>

                <button
                  className={`${
                    loginOrRegister === "login"
                      ? "hover:text-opacity-50 cursor-pointer text-gray-400"
                      : "cursor-default" +
                        " " +
                        "text-" +
                        finalColorForImgBackgroundMode
                  } text-lg focus-1-offset`}
                  onClick={() => {
                    setLoginOrRegister("register");
                  }}
                >
                  Register
                </button>
              </div>

              <div className="mt-3 mb-5 flex flex-col items-center">
                {loginOrRegister === "login" ? (
                  <div className="w-48">
                    <p>Email address / username</p>
                    <Profile_input ref={firstFieldRef} />
                  </div>
                ) : (
                  <>
                    <div className="w-48">
                      <p>Username</p>
                      <Profile_input />
                    </div>
                    <div className="mt-1 w-48">
                      <p>Email address</p>
                      <Profile_input />
                    </div>
                  </>
                )}

                <div
                  className={`${loginOrRegister === "register" ? "mt-3" : ""}`}
                >
                  <div className="mt-1 w-48">
                    <p>Password</p>
                    <Profile_input />
                  </div>

                  {loginOrRegister === "register" && (
                    <div className="mt-1 w-48">
                      <p>Confirm password</p>
                      <Profile_input />
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-center">
                {loginOrRegister === "login" ? (
                  <button
                    className={`w-24 border border-${uiColor} rounded-md px-1 pb-px hover:bg-${uiColor} hover:bg-opacity-50 transition-colors duration-150
                  focus:outline-none focus-visible:ring-1 ring-${uiColor}`}
                    onClick={() => {
                      if (loggedInState === false) {
                        setLoggedInState(true);
                      }
                      upperUiContext.upperVisDispatch({
                        type: "PROFILE_TOGGLE",
                      });
                      upperUiContext.upperVisDispatch({
                        type: "MESSAGE_OPEN_LOGIN",
                      });
                    }}
                  >
                    Login
                  </button>
                ) : (
                  <button
                    className={`w-24 border border-${uiColor} rounded-md px-1 pb-px hover:bg-${uiColor} hover:bg-opacity-50 transition-colors duration-150
                  focus:outline-none focus-visible:ring-1 ring-${uiColor}
                  `}
                  >
                    Register
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </FocusLock>
  );
}

export default Profile;
