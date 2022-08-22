import React, { useState, useEffect, useRef } from "react";
import FocusLock from "react-focus-lock";
import { useNavigate } from "react-router-dom";
import { useMutation } from "urql";

// import { ReactComponent as CancelSVG } from "../../svgs/alphabet-x.svg";
// import { ReactComponent as EyeSVG } from "../../svgs/eye.svg";
// import { ReactComponent as EyeOffSVG } from "../../svgs/eye-off.svg";

import LogRegProfile_input from "./LogRegProfile_input";

// import { useLoggedInState } from "../../state/hooks/useLoggedInState";
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
  // notification happens after register, but is displayed in login window
  const loginNotification = useAuth((store) => store.loginNotification);
  const setLoginNotification = useAuth((store) => store.setLoginNotification);
  const setMessagePopup = useAuth((store) => store.setMessagePopup);

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

  // useEffect(() => {
  //   document.addEventListener("keydown", handleKeyDown);
  //   return () => {
  //     document.removeEventListener("keydown", handleKeyDown);
  //   };
  // });

  // useEffect(() => {
  //   // setLoginNotification(null);
  //   return () => {
  //     setLoginNotification(null);
  //   };
  // });

  // function handleKeyDown(event: KeyboardEvent) {
  //   handleKeyDown_upperUiSetting(event.code, upperUiContext, 8);
  // }

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

        if (res.error) {
          console.log(res.error.message);
          setLoginErrorMessage("Unknown server error");
          return;
        }

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

        // upperUiContext.upperVisDispatch({
        //   type: "PROFILE_TOGGLE",
        // });

        // upperUiContext.upperVisDispatch({
        //   type: "MESSAGE_OPEN_LOGIN",
        // });

        setMessagePopup("Login successful");

        navigate("/", { replace: true });
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

        if (!res.data?.addUser) {
          if (res.error) {
            console.log(res.error.message);
            setRegisterErrorMessage("Unknown server error");
          }

          if (res.data?.addUser?.error) {
            setRegisterErrorMessage(res.data?.addUser?.error);
            return;
          }

          setRegisterErrorMessage("An unknown error has occured");
          return;
        }

        setRegisterErrorMessage(null);
        setLoginErrorMessage(null);
        setLoginNotification("User successfully registered");
        setUsername("");
        setEmail("");
        setPasswordForRegister("");
        setPasswordForRegisterConfirm("");
        setEmail_or_name(username);
        // navigate("/login");
        setLoginOrRegister("login");
        return;
      },
      (err) => {
        console.log(err);
        setRegisterErrorMessage("Server connection Error");
        return;
      }
    );
  }

  return (
    <div className="">
      <div className="mx-auto w-32 flex justify-between">
        <button
          onClick={() => {
            setLoginOrRegister("login");
            setLoginNotification(null);
            setLoginErrorMessage(null);
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
            // setLoginNotification(null);
            setRegisterErrorMessage(null);
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

        <div className={`${loginOrRegister === "register" ? "mt-3" : ""}`}>
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
                loginOrRegister === "login" ? password : passwordForRegister
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

        {/* {loginOrRegister === "login" && (
          <button
            className={`mt-1 text-sm text-gray-400 hover:text-opacity-50 cursor-pointer  focus-1-offset`}
            onClick={() => {
              navigate("/passforgot");
            }}
          >
            <span>Forgot password?</span>
          </button>
        )} */}

        {loginOrRegister === "login" && loginErrorMessage && (
          <AuthNotification
            notificationType="error"
            notification={loginErrorMessage}
          />
        )}
        {loginOrRegister === "register" && registerErrorMessage && (
          <AuthNotification
            notificationType="error"
            notification={registerErrorMessage}
          />
        )}
        {loginOrRegister === "login" && loginNotification && (
          <AuthNotification
            notificationType="confirmation"
            notification={loginNotification}
          />
        )}
      </div>

      <div className="flex justify-center">
        {loginOrRegister === "login" ? (
          <div className="flex flex-col -mb-1">
            <button
              className={`w-24 border border-${uiColor} rounded-md px-1 pb-px hover:bg-${uiColor} hover:bg-opacity-50 transition-colors duration-150
                  focus:outline-none focus-visible:ring-1 ring-${uiColor}`}
              onClick={loginValidation}
            >
              Login
            </button>
            <button
              className={`mt-0.5 text-sm text-gray-400 hover:text-opacity-50 cursor-pointer  focus-1-offset`}
              onClick={() => {
                navigate("/passforgot");
              }}
            >
              <span>Forgot password?</span>
            </button>
          </div>
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
  );
}

export default LoginRegister;
