import React, { useRef, useEffect, useState } from "react";
import FocusLock from "react-focus-lock";
import { useNavigate } from "react-router-dom";
import { useMutation } from "urql";

import { useUpperUiContext } from "../../context/upperUiContext";
import { ReactComponent as CancelSVG } from "../../svgs/alphabet-x.svg";

import AuthNotification from "./AuthNotification";
import LogRegProfile_input from "./LogRegProfile_input";

import { ForgotPasswordMutation } from "../../graphql/graphqlMutations";

import { AuthDataForgotPassword_i } from "../../../../schema/types/authDataType";
import { GlobalSettingsState } from "../../utils/interfaces";

interface Props {
  mainPaddingRight: boolean;
  scrollbarWidth: number;
  globalSettings: GlobalSettingsState;
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

  const [email, setEmail] = useState("");

  const [errorMessage, setErrorMessage] = useState<null | string>(null);
  const [notificationMessage, setNotificationMessage] = useState<null | string>(
    null
  );

  const [forgotPasswordMutResult, forgotPasswordMut] = useMutation<
    any,
    AuthDataForgotPassword_i
  >(ForgotPasswordMutation);

  useEffect(() => {
    if (firstFieldRef.current !== null) {
      firstFieldRef.current.focus();
    }
  }, []);

  function sendPasswordChangeLink() {
    if (email === "" || email.indexOf("@") === -1) {
      setErrorMessage("Invalid email");
      setNotificationMessage(null);
      return;
    }

    forgotPasswordMut({
      email,
    }).then(
      (res) => {
        if (!res) {
          setErrorMessage("Server connection Error");
          return;
        }

        if (
          res.error?.message.includes(
            "Can't send mail - all recipients were rejected"
          )
        ) {
          setErrorMessage("Can't send mail - recipient rejected");
          return;
        }

        if (res.error) {
          console.log(res.error.message);
          setErrorMessage("Unknown server error");
          return;
        }

        if (!res.data?.forgotPassword) {
          setErrorMessage("Email does not exist in the database");
          return;
        }

        setErrorMessage(null);
        setNotificationMessage("Email successfully sent");
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
            A password change link will be sent to the provided email address.
          </p>

          <p>Email address</p>
          <LogRegProfile_input
            ref={firstFieldRef}
            inputValue={email}
            setInputValue={setEmail}
            preventCopyPaste={false}
            passwordInputType={false}
            passVisible={undefined}
          />
        </div>

        <button
          className={`mt-1 text-${uiColor} hover:text-opacity-50 cursor-pointer  focus-1-offset`}
          onClick={() => {
            navigate("/login-register");
          }}
          aria-label={"Back"}
        >
          <span>Back</span>
        </button>

        {errorMessage && (
          <AuthNotification
            notificationType="error"
            notification={errorMessage}
          />
        )}
        {notificationMessage && (
          <AuthNotification
            notificationType="confirmation"
            notification={notificationMessage}
          />
        )}
      </div>

      <div className="flex justify-center">
        <button
          className={`w-24 border border-${uiColor} rounded-md px-1 pb-px hover:bg-${uiColor} hover:bg-opacity-50 transition-colors duration-150
                  focus:outline-none focus-visible:ring-1 ring-${uiColor}`}
          onClick={
            // console.log("password send")
            sendPasswordChangeLink
          }
          aria-label={"Send link"}
        >
          Send link
        </button>
      </div>
    </>
  );
}

export default PassordForgotten;
