import React, { useState, useEffect, useRef } from "react";
import FocusLock from "react-focus-lock";
import { useNavigate } from "react-router-dom";
import { useMutation } from "urql";

import { ReactComponent as CancelSVG } from "../../svgs/alphabet-x.svg";

import LoginRegister_input from "./LoginRegister_input";

// import { useLoggedInState } from "../../state/hooks/useLoggedInState";
// import { useDefaultColors } from "../../state/hooks/colorHooks";
import { useUpperUiContext } from "../../context/upperUiContext";
// import { useAuthContext } from "../../context/authContext";
import { useAuth } from "../../state/hooks/useAuth";

import { handleKeyDown_upperUiSetting } from "../../utils/funcs and hooks/handleKeyDown_upperUiSettings";
import { SettingsDatabase_i } from "../../../../schema/types/settingsType";
import { LoginMutation } from "../../graphql/graphqlMutations";

import { AuthDataInput_i } from "../../../../schema/types/authDataType";

interface Props {
  mainPaddingRight: boolean;
  scrollbarWidth: number;
  globalSettings: SettingsDatabase_i;
}

function LoginRegister({
  mainPaddingRight,
  scrollbarWidth,
  globalSettings,
}: Props): JSX.Element {
  let navigate = useNavigate()
  const loginAttempt = useAuth((state) => state.loginAttempt);

  // const uiColor = useDefaultColors((state) => state.uiColor);
  const uiColor = globalSettings.uiColor;

  const [loginOrRegister, setLoginOrRegister] = useState<"login" | "register">(
    "login"
  );
  // const loggedInState = useLoggedInState((state) => state.loggedInState);
  // const setLoggedInState = useLoggedInState((state) => state.setLoggedInState);

  const upperUiContext = useUpperUiContext();
  const authContext = useAuth();

  let firstFieldRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [email_or_name, setEmail_or_name] = useState("");
  const [password, setPassword] = useState("");
  const [passwordForRegister, setPasswordForRegister] = useState("");
  const [passwordForRegisterConfirm, setPasswordForRegisterConfirm] =
    useState("");
  const [loginErrorMessage, setLoginErrorMessage] = useState<null | string>(
    null
  );

  const [loginMutResult, loginMut] = useMutation<any, AuthDataInput_i>(
    LoginMutation
  );

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

  function loginValidation() {
    console.log("sth");

    if (email_or_name === "" || password === "") {
      // !!! change
      setLoginErrorMessage("Email or password not provided");
      console.log("Email or password not provided");
      return;
    }

    console.log("name email provided");


    

    // diffent than in apollo!
    loginMut({
      email_or_name: email_or_name,
      password: password,
    }).then(
      (res) => {
        console.log("RES DATA");
        console.log(res.data);
        console.log(res.data.loginMutation);
        
      
        if (res.data.loginMutation.error === "User does not exist!") {
        // if (res.data.login.token === "User does not exist!") {
          // setLoginErrorMessage(`${res.data.login.token}`);
          console.log(res.data.loginMutation.error);
          setLoginErrorMessage(`${res.data.loginMutation.error}`);
          return;
        }

        if (res.data.loginMutation.error === "Password is incorrect!") {
        // if (res.data.login.token === "Password is incorrect!") {
          // setLoginErrorMessage(`${res.data.login.token}`);
          console.log(res.data.loginMutation.error);
          setLoginErrorMessage(`${res.data.loginMutation.error}`);
          return;
        }


        if (!res) {
          return;
        }

        // if (loggedInState === false) {
        //   setLoggedInState(true);
        // }

        // console.log("loginMut res");
        // console.log(res);

        setLoginErrorMessage(null);

        
        loginAttempt(res.data.ok, res.data.loginMutation.userId, res.data.loginMutation.token)

        // authContext.updateAuthContext({
        //   ...authContext,
        //   isAuthenticated: true,
        //   authenticatedUserId: res.data.loginMutation.userId,
        //   // authenticatedUserId: res.data.login.userId,
        //   accessToken: res.data.loginMutation.token,
        //   // accessToken: res.data.login.token,
        //   // token: res.data.login.token,
        // });




        // !!! display message that the login was successful
        // setLoginNotification(null);

        // history.push('/')
        // no going back! not possible to go back to login when logged in
        // !!! no react router will be implemented?
        // history.replace("/");

        // history.replace("/") equivalent in react-router-dom 6
        navigate("/", {replace: true})


        // upperUiContext.upperVisDispatch({
        //   type: "PROFILE_TOGGLE",
        // });




        upperUiContext.upperVisDispatch({
          type: "MESSAGE_OPEN_LOGIN",
        });

      },
      (err) => {
        console.log(err);
        setLoginErrorMessage("Server connection Error");
        return;
      }
    );
  }

  return (
    <FocusLock>
      <div
        // justify-center changed to paddingTop so login & register are on the same height
        className="flex flex-col z-50 fixed h-full w-screen items-center"
        style={{ backgroundColor: "rgba(90, 90, 90, 0.4)", paddingTop: "30vh" }}
        onClick={() => {
          // upperUiContext.upperVisDispatch({ type: "PROFILE_TOGGLE" });
          navigate("/")
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

                  navigate("/")

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
                    <LoginRegister_input
                      ref={firstFieldRef}
                      inputValue={email_or_name}
                      setInputValue={setEmail_or_name}
                    />
                  </div>
                ) : (
                  <>
                    <div className="w-48">
                      <p>Username</p>
                      <LoginRegister_input
                        inputValue={name}
                        setInputValue={setName}
                      />
                    </div>
                    <div className="mt-1 w-48">
                      <p>Email address</p>
                      <LoginRegister_input
                        inputValue={email}
                        setInputValue={setEmail}
                      />
                    </div>
                  </>
                )}

                <div
                  className={`${loginOrRegister === "register" ? "mt-3" : ""}`}
                >
                  <div className="mt-1 w-48">
                    <p>Password</p>
                    <LoginRegister_input
                      inputValue={loginOrRegister === "login"? password : passwordForRegister}
                      setInputValue={loginOrRegister === "login" ?  setPassword : setPasswordForRegister}
                    />
                  </div>

                  {loginOrRegister === "register" && (
                    <div className="mt-1 w-48">
                      <p>Confirm password</p>
                      <LoginRegister_input
                        inputValue={passwordForRegisterConfirm}
                        setInputValue={setPasswordForRegisterConfirm}
                      />
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
                      loginValidation();
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

export default LoginRegister;
