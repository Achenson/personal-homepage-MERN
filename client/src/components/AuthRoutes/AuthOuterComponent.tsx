import React, { useState, useEffect, useRef, ReactChild } from "react";
import FocusLock from "react-focus-lock";
import { useNavigate } from "react-router-dom";
import { useMutation } from "urql";

import { ReactComponent as CancelSVG } from "../../svgs/alphabet-x.svg";
// import { ReactComponent as EyeSVG } from "../../svgs/eye.svg";
// import { ReactComponent as EyeOffSVG } from "../../svgs/eye-off.svg";

import LogRegProfile_input from "./LogRegProfile_input";

// import { useLoggedInState } from "../../state/hooks/useLoggedInState";
import { useUpperUiContext } from "../../context/upperUiContext";
// import { useAuthContext } from "../../context/authContext";
import { useAuth } from "../../state/hooks/useAuth";

import { handleKeyDown_upperUiSetting } from "../../utils/funcs and hooks/handleKeyDown_upperUiSettings";
import { LoginMutation, AddUserMutaton } from "../../graphql/graphqlMutations";
import { GlobalSettingsState } from "../../utils/interfaces";


interface Props {
  mainPaddingRight: boolean;
  scrollbarWidth: number;
  globalSettings: GlobalSettingsState;
  children: ReactChild;
  // loginNotification: string | null;
  // setLoginNotification: React.Dispatch<React.SetStateAction<string | null>>;
}

function LoginRegister({
  mainPaddingRight,
  scrollbarWidth,
  globalSettings,
  children,
}: // loginNotification,
// setLoginNotification,
Props): JSX.Element {
  let navigate = useNavigate();
  //   const loginAttempt = useAuth((store) => store.loginAttempt);
  //   const loginNotification = useAuth((store) => store.loginNotification);
  //   const setLoginNotification = useAuth((store) => store.setLoginNotification);

  // const uiColor = useDefaultColors((state) => state.uiColor);
  const uiColor = globalSettings.uiColor;

  // const loggedInState = useLoggedInState((state) => state.loggedInState);
  // const setLoggedInState = useLoggedInState((state) => state.setLoggedInState);

  const upperUiContext = useUpperUiContext();

  //   let firstFieldRef = useRef<HTMLInputElement>(null);
  //   let secondFieldRef = useRef<HTMLInputElement>(null);

  //   useEffect(() => {
  //     if (firstFieldRef.current !== null) {
  //       firstFieldRef.current.focus();
  //     }
  //   }, []);

  //   useEffect(() => {
  //     if (
  //       secondFieldRef.current !== null &&
  //       loginNotification === "User successfully registered"
  //     ) {
  //       secondFieldRef.current.focus();
  //     }
  //   }, [loginNotification]);

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

  // useEffect(() => {
  //   // setLoginNotification(null);
  //   return () => {
  //     setLoginNotification(null);
  //   };
  // });

  function handleKeyDown(event: KeyboardEvent) {
    handleKeyDown_upperUiSetting(event.code, upperUiContext, 8, navigate);
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

                  // upperUiContext.upperVisDispatch({
                  //   type: "FOCUS_ON_UPPER_RIGHT_UI",
                  //   payload: 8,
                  // });fha


                }}
                aria-label={"Close"}
              >
                <CancelSVG className="h-5 w-5 fill-current text-gray-600 cursor-pointer hover:text-gray-900" />
              </button>
            </div>

            {children}
          </div>
        </div>
      </div>
    </FocusLock>
  );
}

export default LoginRegister;
