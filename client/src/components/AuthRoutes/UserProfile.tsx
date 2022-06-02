import React, { useState, useEffect, useRef } from "react";
import FocusLock from "react-focus-lock";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "urql";

import { ReactComponent as CancelSVG } from "../../svgs/alphabet-x.svg";

import LoginRegister_input from "./LoginRegister_input";

// import { useLoggedInState } from "../../state/hooks/useLoggedInState";
// import { useDefaultColors } from "../../state/hooks/colorHooks";
import { useUpperUiContext } from "../../context/upperUiContext";
// import { useAuthContext } from "../../context/authContext";
import { useAuth } from "../../state/hooks/useAuth";

import { handleKeyDown_upperUiSetting } from "../../utils/funcs and hooks/handleKeyDown_upperUiSettings";
import { SettingsDatabase_i } from "../../../../schema/types/settingsType";
import { LoginMutation, LogoutMutation } from "../../graphql/graphqlMutations";

import { UserQuery } from "../../graphql/graphqlQueries";

import { AuthDataInput_i } from "../../../../schema/types/authDataType";

interface Props {
  mainPaddingRight: boolean;
  scrollbarWidth: number;
  globalSettings: SettingsDatabase_i;
}

function UserProfile({
  mainPaddingRight,
  scrollbarWidth,
  globalSettings,
}: Props): JSX.Element {
  let navigate = useNavigate();
  const loginAttempt = useAuth((state) => state.loginAttempt);
  const userId = useAuth((state) => state.authenticatedUserId);

  // const uiColor = useDefaultColors((state) => state.uiColor);
  const uiColor = globalSettings.uiColor;

  const [loginOrRegister, setLoginOrRegister] = useState<"login" | "register">(
    "login"
  );
  // const loggedInState = useLoggedInState((state) => state.loggedInState);
  // const setLoggedInState = useLoggedInState((state) => state.setLoggedInState);

  const upperUiContext = useUpperUiContext();
  const authContext = useAuth();
  const logout = useAuth((state) => state.logout);

  let firstFieldRef = useRef<HTMLInputElement>(null);

  const [passwordCurrent, setPasswordCurrent] = useState("");
  const [passwordNew, setPasswordNew] = useState("");
  const [passwordNewConfirm, setPasswordNewConfirm] = useState("");

  const [loginErrorMessage, setLoginErrorMessage] = useState<null | string>(
    null
  );

  const [loginMutResult, loginMut] = useMutation<any, AuthDataInput_i>(
    LoginMutation
  );

  const [logoutMutResult, logoutMut] = useMutation<any, any>(LogoutMutation);

  const [inputMode, setInputMode] = useState<
    "initial" | "editProfile" | "changePassword" | "deleteAccount"
  >("initial");

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

  const [userResults] = useQuery({
    query: UserQuery,
    variables: { userId: userId },
  });

  const { data, fetching, error } = userResults;
  /* 
  if (data) {
    setName(data.user.name);
    setEmail(data.user.email);
  } */

  /* useEffect( () => {

    
    setName(data.user.name)
    setEmail(data.user.email)
  }, [data]) */

  const [name, setName] = useState("");
  // const [name, setName] = useState(data ? data.user.name : "");
  const [email, setEmail] = useState("");
  // const [email, setEmail] = useState(data ? data.user.email : "");

  useEffect(() => {
    if (data) {
      setName(data.user.name);
      setEmail(data.user.email);
    }
  }, [data]);

  if (fetching) return <p>Loading...</p>;
  if (error) return <p>Oh no... {error.message}</p>;

  console.log(data.user);

  function handleKeyDown(event: KeyboardEvent) {
    handleKeyDown_upperUiSetting(event.code, upperUiContext, 8);
  }

  /*  function loginValidation() {
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

        loginAttempt(
          res.data.ok,
          res.data.loginMutation.userId,
          res.data.loginMutation.token
        );

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
  } */

  const renderPasswordCurrent = (
    inputModeOn: "editProfile" | "changePassword" | "deleteAccount"
  ) => (
    <div>
      <p>{inputModeOn === "changePassword" ? "Current " : "Enter "}password</p>
      <LoginRegister_input
        inputValue={passwordCurrent}
        setInputValue={setPasswordCurrent}
      />
    </div>
  );

  function renderInputs(
    inputMode: "initial" | "editProfile" | "changePassword" | "deleteAccount"
  ) {
    switch (inputMode) {
      case "initial":
        return <div className=""></div>;
      case "editProfile":
        return (
          <div className="h-44">
            {renderPasswordCurrent("editProfile")}
            <div className="mt-1">
              <p>Username</p>
              <LoginRegister_input inputValue={name} setInputValue={setName} />
            </div>
            <div className="mt-1">
              <p>Email address</p>
              <LoginRegister_input
                inputValue={email}
                setInputValue={setEmail}
              />
            </div>
          </div>
        );

      case "changePassword":
        return (
          <div className="h-44">
            {renderPasswordCurrent("changePassword")}
            <div className="mt-1">
              <p>New password</p>
              <LoginRegister_input
                inputValue={passwordNew}
                setInputValue={setPasswordNew}
              />
            </div>
            <div className="mt-1">
              <p>Confirm password</p>
              <LoginRegister_input
                inputValue={passwordNewConfirm}
                setInputValue={setPasswordNewConfirm}
              />
            </div>
          </div>
        );

      case "deleteAccount":
        return (
          <div className="h-44">
            {renderPasswordCurrent("deleteAccount")}
            <p className="mt-1 text-red-500">
              Enter password and confirm. All account information will be
              irreversibly lost.
            </p>
          </div>
        );
    }
  }

  return (
    <FocusLock>
      <div
        // justify-center changed to paddingTop so login & register are on the same height
        className="flex flex-col z-50 fixed h-full w-screen items-center"
        style={{ backgroundColor: "rgba(90, 90, 90, 0.4)", paddingTop: "30vh" }}
        onClick={() => {
          // upperUiContext.upperVisDispatch({ type: "PROFILE_TOGGLE" });
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
              <p className="text-center">
                Logged in as <span className="font-bold">{data.user.name}</span>
              </p>

              <div className="mt-3 mb-3">
                <div className="flex flex-col items-center mb-1">
                  <div className="w-48">
                    {renderInputs(inputMode)}
                    {/*     <div>
                      <p>Current password</p>
                      <LoginRegister_input
                        inputValue={passwordCurrent}
                        setInputValue={setPasswordCurrent}
                      />
                    </div>
                    <div className="mt-1">
                      <p>Username</p>
                      <LoginRegister_input
                        inputValue={name}
                        setInputValue={setName}
                      />
                    </div>
                    <div className="mt-1">
                      <p>Email address</p>
                      <LoginRegister_input
                        inputValue={email}
                        setInputValue={setEmail}
                      />
                    </div> */}
                  </div>
                </div>

                <div className="mb-5 flex flex-col items-center">
                  <button
                    className={`w-24 mb-3 hover:text-${uiColor} transition-colors duration-150 focus-1-offset-dark ${
                      inputMode === "initial" ? "hidden" : ""
                    }`}
                    onClick={() => {
                      setInputMode("editProfile");
                    }}
                  >
                    {inputMode === "deleteAccount" ? "CONFIRM" : "UPDATE"}
                  </button>
                  <button
                    className={`w-24 hover:text-${uiColor} transition-colors duration-150 focus-1-offset-dark ${
                      inputMode === "editProfile" ? "hidden" : ""
                    }`}
                    onClick={() => {
                      setInputMode("editProfile");
                    }}
                  >
                    Edit profile
                  </button>
                  <button
                    className={`w-36 hover:text-${uiColor} transition-colors duration-150 focus-1-offset-dark ${
                      inputMode === "changePassword" ? "hidden" : ""
                    }`}
                    onClick={() => {
                      setInputMode("changePassword");
                    }}
                  >
                    Change password
                  </button>
                  <button
                    className={`w-32 hover:text-${uiColor} transition-colors duration-150 focus-1-offset-dark ${
                      inputMode === "deleteAccount" ? "hidden" : ""
                    }`}
                    onClick={() => {
                      setInputMode("deleteAccount");
                    }}
                  >
                    Delete account
                  </button>
                </div>
              </div>

              {/*   <div className="mt-3 mb-5 flex flex-col items-center">
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
              </div> */}

              <div className="flex justify-center">
                <button
                  className={`w-24 border border-${uiColor} rounded-md px-1 pb-px hover:bg-${uiColor} hover:bg-opacity-50 transition-colors duration-150
                  focus:outline-none focus-visible:ring-1 ring-${uiColor}`}
                  onClick={async () => {
                    await logoutMut();

                    logout();

                    navigate("/login-register");
                  }}
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </FocusLock>
  );
}

export default UserProfile;
