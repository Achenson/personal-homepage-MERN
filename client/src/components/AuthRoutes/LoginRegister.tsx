import React, { useState, useEffect, useRef } from "react";
import FocusLock from "react-focus-lock";
import { useNavigate } from "react-router-dom";
import { useMutation } from "urql";

import { ReactComponent as CancelSVG } from "../../svgs/alphabet-x.svg";
import { ReactComponent as EyeSVG } from "../../svgs/eye.svg";
import { ReactComponent as EyeOffSVG } from "../../svgs/eye-off.svg";

import LogRegProfile_input from "./LogRegProfile_input";

// import { useLoggedInState } from "../../state/hooks/useLoggedInState";
// import { useDefaultColors } from "../../state/hooks/colorHooks";
import { useUpperUiContext } from "../../context/upperUiContext";
// import { useAuthContext } from "../../context/authContext";
import { useAuth } from "../../state/hooks/useAuth";

import { handleKeyDown_upperUiSetting } from "../../utils/funcs and hooks/handleKeyDown_upperUiSettings";
import { SettingsDatabase_i } from "../../../../schema/types/settingsType";
import { LoginMutation, AddUserMutaton } from "../../graphql/graphqlMutations";

import {
  AuthDataInput_i,
  AuthDataInputRegister_i,
} from "../../../../schema/types/authDataType";
import AuthNotification from "./AuthNotification";

interface Props {
  mainPaddingRight: boolean;
  scrollbarWidth: number;
  globalSettings: SettingsDatabase_i;
  // loginNotification: string | null;
  // setLoginNotification: React.Dispatch<React.SetStateAction<string | null>>;
}

function LoginRegister({
  mainPaddingRight,
  scrollbarWidth,
  globalSettings,
}: // loginNotification,
// setLoginNotification,
Props): JSX.Element {
  let navigate = useNavigate();
  const loginAttempt = useAuth((store) => store.loginAttempt);
  const loginNotification = useAuth((store) => store.loginNotification);
  const setLoginNotification = useAuth((store) => store.setLoginNotification);

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
  let secondFieldRef = useRef<HTMLInputElement>(null);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [email_or_name, setEmail_or_name] = useState("");
  const [password, setPassword] = useState("");
  const [passwordForRegister, setPasswordForRegister] = useState("");
  const [passwordForRegisterConfirm, setPasswordForRegisterConfirm] =
    useState("");

  const [passVisible, setPassVisible] = useState(false);

  const [loginErrorMessage, setLoginErrorMessage] = useState<null | string>(
    null
  );

  const [registerErrorMessage, setRegisterErrorMessage] = useState<
    null | string
  >(null);

  const [loginMutResult, loginMut] = useMutation<any, AuthDataInput_i>(
    LoginMutation
  );

  const [addUserMutResult, addUserMut] = useMutation<
    any,
    AuthDataInputRegister_i
  >(AddUserMutaton);

  useEffect(() => {
    if (firstFieldRef.current !== null) {
      firstFieldRef.current.focus();
    }
  }, []);

  useEffect(() => {
    if (
      secondFieldRef.current !== null &&
      loginNotification === "User successfully registered"
    ) {
      secondFieldRef.current.focus();
    }
  }, [loginNotification]);

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
    handleKeyDown_upperUiSetting(event.code, upperUiContext, 8);
  }

  function loginValidation() {
    console.log("sth");
    setLoginNotification(null);

    if (email_or_name === "" || password === "") {
      // !!! change
      setLoginErrorMessage("Please fill out all fields");
      console.log("Email/username or password not provided");
      return;
    }

    console.log("name email provided");

    // diffent than in apollo!
    loginMut({
      email_or_name: email_or_name,
      password: password,
    }).then(
      (res) => {
        if (!res) {
          setLoginErrorMessage("Server connection Error");
          return;
        }

        // console.log("RES DATA");
        // console.log(res.data);
        // console.log(res.data.login);

        if (res.data?.login?.error === "User does not exist") {
          // if (res.data.login.token === "User does not exist!") {
          // setLoginErrorMessage(`${res.data.login.token}`);
          console.log(res.data.login.error);
          setLoginErrorMessage(res.data.login.error);
          return;
        }

        if (res.data?.login?.error === "Password is incorrect") {
          // if (res.data.login.token === "Password is incorrect!") {
          // setLoginErrorMessage(`${res.data.login.token}`);
          console.log(res.data.login.error);
          setLoginErrorMessage(res.data.login.error);
          return;
        }

        // if (loggedInState === false) {
        //   setLoggedInState(true);
        // }

        // console.log("loginMut res");
        // console.log(res);

        setLoginErrorMessage(null);

        loginAttempt(
          res.data?.ok,
          res.data?.login?.userId,
          res.data?.login?.token
        );

        // authContext.updateAuthContext({
        //   ...authContext,
        //   isAuthenticated: true,
        //   authenticatedUserId: res.data.login.userId,
        //   // authenticatedUserId: res.data.login.userId,
        //   accessToken: res.data.login.token,
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
        navigate("/", { replace: true });

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

  function registerValidation() {
    if (username === "") {
      setRegisterErrorMessage("Invalid username");
      return;
    }

    if (username.indexOf("@") > -1) {
      setRegisterErrorMessage("Invalid username - @ symbol is not allowed");
      return;
    }

    if (email === "" || email.indexOf("@") === -1) {
      setRegisterErrorMessage("Invalid email");
      return;
    }

    if (passwordForRegister === "") {
      setRegisterErrorMessage("Invalid password");
      return;
    }

    if (passwordForRegister.length < 8) {
      setRegisterErrorMessage("Password must contain at least 8 characters");
      return;
    }

    if (passwordForRegister !== passwordForRegisterConfirm) {
      setRegisterErrorMessage("Password confirmation does not match");
      return;
    }

    addUserMut({
      name: username,
      email: email,
      password: passwordForRegister,
      // refetchQueries: [{ query: getStatsQuery }],
      // useMutation mutate function does not call `onCompleted`!
      // so onCompleted can only be passed to initial hook
      // workaround: useMutation returns a Promise
    }).then(
      (res) => {
        if (!res) {
          setRegisterErrorMessage("Server connection Error");
          return;
        }

        console.log("ADD USER RES");
        console.log(res);

        if (res.data?.addUser) {
          setRegisterErrorMessage(null);
          setLoginNotification("User successfully registered");
          setUsername("");
          setEmail("");
          setPasswordForRegister("");
          setPasswordForRegisterConfirm("");
          setEmail_or_name(username);
          // navigate("/login");
          setLoginOrRegister("login");
          return;
        } else {
          setRegisterErrorMessage("Username or email is already in use");
          return;
        }
      },
      (err) => {
        console.log(err);
        setRegisterErrorMessage("Server connection Error");
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

            <div className="">
              <div className="mx-auto w-32 flex justify-between">
                <button
                  onClick={() => {
                    setLoginOrRegister("login");
                    setLoginNotification(null);
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
                    setLoginNotification(null);
                  }}
                >
                  Register
                </button>
              </div>

              <div className="mt-3 mb-5 flex flex-col items-center">
                {loginOrRegister === "login" ? (
                  <div className="w-48">
                    <p>Email address / username</p>
                    <LogRegProfile_input
                      ref={firstFieldRef}
                      inputValue={email_or_name}
                      setInputValue={setEmail_or_name}
                      preventCopyPaste={false}
                      passwordInputType={false}
                      passVisible={undefined}
                    />
                  </div>
                ) : (
                  <>
                    <div className="w-48">
                      <p>Username</p>
                      <LogRegProfile_input
                        inputValue={username}
                        setInputValue={setUsername}
                        preventCopyPaste={false}
                        passwordInputType={false}
                        passVisible={undefined}
                      />
                    </div>
                    <div className="mt-1 w-48">
                      <p>Email address</p>
                      <LogRegProfile_input
                        inputValue={email}
                        setInputValue={setEmail}
                        preventCopyPaste={false}
                        passwordInputType={false}
                        passVisible={undefined}
                      />
                    </div>
                  </>
                )}

                <div
                  className={`${loginOrRegister === "register" ? "mt-3" : ""}`}
                >
                  <div className="mt-1 w-48">
                    <div className="flex items-center justify-between">
                      <p>Password</p>

                      {/* <span>&nbsp;</span> */}

                      <button
                        className="focus-1-offset"
                        onClick={() => {
                          setPassVisible(!passVisible);
                        }}
                      >
                        <span className={`text-sm text-${uiColor}`}>
                          {passVisible ? "hide" : "show"}
                        </span>
                      </button>
                      {/* <button
                        className="h-5 w-5 focus-2-offset-dark"
                        onClick={() => {
                          console.log("eye clicked");
                        }}
                        aria-label={"Show Password"}
                      >
                        <EyeSVG className="h-4 w-4 cursor-pointer hover:text-blue-900" />
                      </button> */}
                    </div>

                    <LogRegProfile_input
                      ref={secondFieldRef}
                      inputValue={
                        loginOrRegister === "login"
                          ? password
                          : passwordForRegister
                      }
                      setInputValue={
                        loginOrRegister === "login"
                          ? setPassword
                          : setPasswordForRegister
                      }
                      preventCopyPaste={true}
                      passwordInputType={true}
                      passVisible={passVisible}
                    />
                  </div>

                  {loginOrRegister === "register" && (
                    <div className="mt-1 w-48">
                      <p>Confirm password</p>
                      <LogRegProfile_input
                        inputValue={passwordForRegisterConfirm}
                        setInputValue={setPasswordForRegisterConfirm}
                        preventCopyPaste={true}
                        passwordInputType={true}
                        passVisible={passVisible}
                      />
                    </div>
                  )}
                </div>
                {loginOrRegister === "login" && (
                  <button
                    className={`mt-1 text-sm text-gray-400 hover:text-opacity-50 cursor-pointer  focus-1-offset`}
                    onClick={() => {
                      navigate("/passforgot");
                    }}
                  >
                    <span>Forgot password?</span>
                  </button>
                )}

                {loginOrRegister === "login" && loginErrorMessage && (
                  <AuthNotification
                    colorClass="red-500"
                    notification={loginErrorMessage}
                  />
                )}
                {loginOrRegister === "register" && registerErrorMessage && (
                  <AuthNotification
                    colorClass="red-500"
                    notification={registerErrorMessage}
                  />
                )}
                {loginOrRegister === "login" && loginNotification && (
                  <AuthNotification
                    colorClass="green-500"
                    notification={loginNotification}
                  />
                )}
              </div>

              <div className="flex justify-center">
                {loginOrRegister === "login" ? (
                  <button
                    className={`w-24 border border-${uiColor} rounded-md px-1 pb-px hover:bg-${uiColor} hover:bg-opacity-50 transition-colors duration-150
                  focus:outline-none focus-visible:ring-1 ring-${uiColor}`}
                    onClick={loginValidation}
                  >
                    Login
                  </button>
                ) : (
                  <button
                    className={`w-24 border border-${uiColor} rounded-md px-1 pb-px hover:bg-${uiColor} hover:bg-opacity-50 transition-colors duration-150
                  focus:outline-none focus-visible:ring-1 ring-${uiColor}
                  `}
                    onClick={registerValidation}
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
