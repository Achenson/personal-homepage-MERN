import React, { useRef, useEffect, useState } from "react";
import FocusLock from "react-focus-lock";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation } from "urql";

import { SettingsDatabase_i } from "../../../../schema/types/settingsType";
import { useUpperUiContext } from "../../context/upperUiContext";
import { ReactComponent as CancelSVG } from "../../svgs/alphabet-x.svg";

import AuthNotification from "./AuthNotification";
import LogRegProfile_input from "./LogRegProfile_input";

import { ChangePasswordAfterForgotMutation } from "../../graphql/graphqlMutations";

import { useAuth } from "../../state/hooks/useAuth";

import { AuthDataPasswordChangeAfterForgot_i } from "../../../../schema/types/authDataType";
import { resolveSoa } from "dns";

interface Props {
  mainPaddingRight: boolean;
  scrollbarWidth: number;
  globalSettings: SettingsDatabase_i;
  // loginNotification: string | null;
  // setLoginNotification: React.Dispatch<React.SetStateAction<string | null>>;
}

function ForgottenPassChange({
  mainPaddingRight,
  scrollbarWidth,
  globalSettings,
}: Props): JSX.Element {
  let navigate = useNavigate();
  // from ".../passforgot-change/:token"
  let { token } = useParams();
  const upperUiContext = useUpperUiContext();
  const uiColor = globalSettings.uiColor;

  const loginAttempt = useAuth((store) => store.loginAttempt);

  let firstFieldRef = useRef<HTMLInputElement>(null);

  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirm, setNewPasswordConfirm] = useState("");

  const [errorMessage, setErrorMessage] = useState<null | string>(null);
  const [notificationMessage, setNotificationMessage] = useState<null | string>(
    null
  );

  const [changePasswordAfterForgotMutResult, changePasswordAfterForgotMut] =
    useMutation<any, AuthDataPasswordChangeAfterForgot_i>(
      ChangePasswordAfterForgotMutation
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

    changePasswordAfterForgotMut({
      token: token as string,
      newPassword,
    }).then(
      (res) => {
        if (!res) {
          setErrorMessage("Server connection Error");
          return;
        }

        console.log("res.data");
        console.log(res.data);
        console.log(res);

        if (!res.data?.changePasswordAfterForgot?.userId) {
          // if no specific error is received from the server
          if (res.data?.changePasswordAfterForgot?.error) {
            setErrorMessage(res.data?.changePasswordAfterForgot?.error);
            setNotificationMessage(null);
            return;
          }

          if (res.error?.message === "[GraphQL] jwt expired") {
            // [GraphQL] jwt expired
            setErrorMessage("Session expired - redirecting...");
            setNotificationMessage(null);
            setTimeout(() => {
              navigate("/passforgot");
            }, 2500);
            return;
          }

          setErrorMessage("An unknown error has occured");
          setNotificationMessage(null);
          return;
        }

        setErrorMessage(null);
        setNotificationMessage("Password successfully changed. Logging in...");

        // loginAttempt(
        //   true,
        //   res.data.changePasswordAfterForgot.userId,
        //   res.data.changePasswordAfterForgot.token
        // );

        setTimeout(() => {
          loginAttempt(
            true,
            res.data.changePasswordAfterForgot.userId,
            res.data.changePasswordAfterForgot.token
          );
          navigate("/");
        }, 2500);
      },
      (err) => {
        console.log(err);
        setErrorMessage("Server connection Error");
        return;
      }
    );
  }

  return (
    <>
      <div className="mt-3 mb-5 flex flex-col items-center">
        <div className="w-48">
          {/* <p className="text-xl">Password Retrieval</p> */}
          <p className="text-sky-600 text-sm mb-2">
            SmoothTabs password change
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
          <AuthNotification colorClass="red-500" notification={errorMessage} />
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
          onClick={
            // console.log("password send")
            sendPasswordChangeLink
          }
        >
          Change password
        </button>
      </div>
    </>
  );
}

export default ForgottenPassChange;
