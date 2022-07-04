import React, { useRef, useEffect, useState } from "react";
import FocusLock from "react-focus-lock";
import { useNavigate } from "react-router-dom";

import { SettingsDatabase_i } from "../../../../schema/types/settingsType";
import { useUpperUiContext } from "../../context/upperUiContext";
import { ReactComponent as CancelSVG } from "../../svgs/alphabet-x.svg";

import AuthNotification from "./AuthNotification";
import LogRegProfile_input from "./LogRegProfile_input";

interface Props {
  mainPaddingRight: boolean;
  scrollbarWidth: number;
  globalSettings: SettingsDatabase_i;
  // loginNotification: string | null;
  // setLoginNotification: React.Dispatch<React.SetStateAction<string | null>>;
}

function PassordForgotten({
  mainPaddingRight,
  scrollbarWidth,
  globalSettings,
}: Props): JSX.Element {
  let navigate = useNavigate();
  const upperUiContext = useUpperUiContext();
  const uiColor = globalSettings.uiColor;

  let firstFieldRef = useRef<HTMLInputElement>(null);

  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirm, setNewPasswordConfirm] = useState("");

  const [errorMessage, setErrorMessage] = useState<null | string>(null);
  const [notificationMessage, setNotificationMessage] = useState<null | string>(
    null
  );

  useEffect(() => {
    if (firstFieldRef.current !== null) {
      firstFieldRef.current.focus();
    }
  }, []);

  function sendPasswordChangeLink() {
    if (newPassword === "") {
      setErrorMessage("Invalid password");
      setNotificationMessage(null);
      return;
    }

    if (newPassword.length < 8) {
      setErrorMessage("Password must contain at least 8 characters");
      setNotificationMessage(null);
      return;
    }

    if (newPassword !== newPasswordConfirm) {
      setErrorMessage("Password confirmation does not match");
      setNotificationMessage(null);
      return;
    }

    setErrorMessage(null);
    setNotificationMessage("Password successfully changed");
  }

  return (
    <FocusLock>
      <div
        // justify-center changed to paddingTop so login & register are on the same height
        className="flex flex-col z-50 fixed h-full w-screen items-center"
        style={{ backgroundColor: "rgba(90, 90, 90, 0.4)", paddingTop: "30vh" }}
        onClick={() => {
          // upperUiContext.upperVisDispatch({ type: "PROFILE_TOGGLE" });
          // setLoginNotification(null);
          navigate("/");
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
            className={`bg-gray-100 pb-3 pt-5 border-2 px-4 border-${uiColor} rounded-sm relative`}
            style={{
              width: `350px`,
              marginLeft: `${
                mainPaddingRight && scrollbarWidth >= 10
                  ? `-${scrollbarWidth - 1}px`
                  : ""
              }`,
            }}
          >
            <div className="absolute right-0 top-0 mt-1 mr-1">
              <button
                className="h-5 w-5 focus-2-offset-dark"
                onClick={() => {
                  // upperUiContext.upperVisDispatch({ type: "PROFILE_TOGGLE" });
                  // setLoginNotification(null);
                  navigate("/");

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

            <div className="mt-3 mb-5 flex flex-col items-center">
              <div className="w-48">
                {/* <p className="text-xl">Password Retrieval</p> */}
                <p className="text-sky-600 text-sm mb-2">
                  Enter new password for user xxxx
                </p>

                <p>New password</p>
                <LogRegProfile_input
                  ref={firstFieldRef}
                  inputValue={newPassword}
                  setInputValue={setNewPassword}
                  preventCopyPaste={true}
                  passwordInputType={true}
                />

                <p>Confirm new password</p>
                <LogRegProfile_input
                  //   ref={firstFieldRef}
                  inputValue={newPasswordConfirm}
                  setInputValue={setNewPasswordConfirm}
                  preventCopyPaste={true}
                  passwordInputType={true}
                />
              </div>

              {errorMessage && (
                <AuthNotification
                  colorClass="red-500"
                  notification={errorMessage}
                />
              )}
              {notificationMessage && (
                <AuthNotification
                  colorClass="green-500"
                  notification={notificationMessage}
                />
              )}
            </div>

            <div className="flex justify-center">
              <button
                className={`w-40 border border-${uiColor} rounded-md px-1 pb-px hover:bg-${uiColor} hover:bg-opacity-50 transition-colors duration-150
                  focus:outline-none focus-visible:ring-1 ring-${uiColor}`}
                onClick={() => {
                  // console.log("password send")
                  sendPasswordChangeLink();
                }}
              >
                Change password
              </button>
            </div>
          </div>
        </div>
      </div>
    </FocusLock>
  );
}

export default PassordForgotten;