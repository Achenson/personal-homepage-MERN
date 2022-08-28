import React, { useState, useEffect, useRef } from "react";
import FocusLock from "react-focus-lock";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "urql";

import { ReactComponent as CancelSVG } from "../../svgs/alphabet-x.svg";

import LogRegProfile_input from "./LogRegProfile_input";

// import { useLoggedInState } from "../../state/hooks/useLoggedInState";
import { useUpperUiContext } from "../../context/upperUiContext";
// import { useAuthContext } from "../../context/authContext";
import { useAuth } from "../../state/hooks/useAuth";

import { DeleteAccountByUser_i } from "../../../../schema/types/deleteAccountByUserType";

import {
  LoginMutation,
  LogoutMutation,
  DeleteAccountByUserMutation,
  ChangeUserByUserMutation,
  ChangePasswordByUserMutation,
} from "../../graphql/graphqlMutations";

import { UserQuery } from "../../graphql/graphqlQueries";

import { AuthDataInput_i } from "../../../../schema/types/authDataType";
import { ChangeUserByUser_i } from "../../../../schema/types/changeUserByUserType";
import { ChangePasswordByUser_i } from "../../../../schema/types/changePasswordByUserType";
import { GlobalSettingsState } from "../../utils/interfaces";

interface Props {
  mainPaddingRight: boolean;
  scrollbarWidth: number;
  globalSettings: GlobalSettingsState;
  // loginNotification: string | null;
  // setLoginNotification: React.Dispatch<React.SetStateAction<string | null>>;
}

function UserProfile({
  mainPaddingRight,
  scrollbarWidth,
  globalSettings,
}: // loginNotification,
// setLoginNotification,
Props): JSX.Element {
  let navigate = useNavigate();
  const loginAttempt = useAuth((store) => store.loginAttempt);
  const logout = useAuth((store) => store.logout);
  const userId = useAuth((store) => store.authenticatedUserId);
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

  const [passwordCurrent, setPasswordCurrent] = useState("");
  const [passwordNew, setPasswordNew] = useState("");
  const [passwordNewConfirm, setPasswordNewConfirm] = useState("");

  const [errorMessage, setErrorMessage] = useState<null | string>(null);
  const [notification, setNotification] = useState<null | string>(null);

  const [passVisible, setPassVisible] = useState(false);


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

  // useEffect(() => {
  //   document.addEventListener("keydown", handleKeyDown);
  //   return () => {
  //     document.removeEventListener("keydown", handleKeyDown);
  //   };
  // });

  useEffect(() => {
    setMessagePopup(null)
  },[])

  const [userResults, reexecuteUserResults] = useQuery({
    query: UserQuery,
    variables: { userId: userId },
  });

  const { data, fetching, error } = userResults;


  const [username, setUsername] = useState("");
  // doesn't get changed by user input
  const [usernameInitial, setUsernameInitial] = useState("");
  // const [name, setName] = useState(data?.user?.name ? data.user.name : "");
  const [email, setEmail] = useState("");
  // doesn't get changed by user input
  const [emailInitial, setEmailInitial] = useState("");
  // const [email, setEmail] = useState(data?.user?.email ? data.user.email : "");

  useEffect(() => {
    if (data?.user) {
      setUsername(data.user.name);
      setUsernameInitial(data.user.name);
      setEmail(data.user.email);
      setEmailInitial(data.user.email);
    }
  }, [data]);

  const [deleteAccountByUserResult, deleteAccountByUser] = useMutation<
    any,
    DeleteAccountByUser_i
  >(DeleteAccountByUserMutation);

  const [changeUserByUserResult, changeUserByUser] = useMutation<
    any,
    ChangeUserByUser_i
  >(ChangeUserByUserMutation);

  const [changePasswordByUserResult, changePasswordByUser] = useMutation<
    any,
    ChangePasswordByUser_i
  >(ChangePasswordByUserMutation);

  if (fetching) return <p>Loading...</p>;
  if (error) return <p>{error.message}</p>;

  // console.log(data.user);

  // function handleKeyDown(event: KeyboardEvent) {
  //   handleKeyDown_upperUiSetting(event.code, upperUiContext, 8);
  // }

  function errMessage(
    errorMessage: string | null,
    notificationNull: boolean = true
  ) {
    setErrorMessage(errorMessage);
    if (notificationNull) {
      setNotification(null);
    }
  }

  const renderPasswordCurrent = (
    inputModeOn: "editProfile" | "changePassword" | "deleteAccount"
  ) => (
    <div>
      <div className="flex items-center justify-between">
        <p>
          {inputModeOn === "changePassword" ? "Current " : "Enter "}password
        </p>
        <button
          className="focus-1-offset"
          onClick={() => {
            setPassVisible(!passVisible);
          }}
          aria-label={"Show/hide password"}
        >
          <span className={`text-sm text-${uiColor}`}>
            {passVisible ? "hide" : "show"}
          </span>
        </button>
      </div>
      <LogRegProfile_input
        inputValue={passwordCurrent}
        setInputValue={setPasswordCurrent}
        preventCopyPaste={true}
        passwordInputType={true}
        passVisible={passVisible}
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
              <LogRegProfile_input
                inputValue={username}
                setInputValue={setUsername}
                preventCopyPaste={false}
                passwordInputType={false}
                passVisible={undefined}
              />
            </div>
            <div className="mt-1">
              <p>Email address</p>
              <LogRegProfile_input
                inputValue={email}
                setInputValue={setEmail}
                preventCopyPaste={false}
                passwordInputType={false}
                passVisible={undefined}
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
              <LogRegProfile_input
                inputValue={passwordNew}
                setInputValue={setPasswordNew}
                preventCopyPaste={true}
                passwordInputType={true}
                passVisible={passVisible}
              />
            </div>
            <div className="mt-1">
              <p>Confirm password</p>
              <LogRegProfile_input
                inputValue={passwordNewConfirm}
                setInputValue={setPasswordNewConfirm}
                preventCopyPaste={true}
                passwordInputType={true}
                passVisible={passVisible}
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
    <div className="">
      <p className="text-center">
        Logged in as <span className="font-bold">{data.user.name}</span>
      </p>

      <div className="mt-3 mb-3">
        <div className="flex flex-col items-center mb-1">
          <div className="w-48">
            {renderInputs(inputMode)}
            <p className="text-red-500 mb-1 text-center">{errorMessage}</p>
            <p className="text-green-500 mb-1 text-center">{notification}</p>
          </div>
        </div>

        <div className="mb-5 flex flex-col items-center">
          <button
            className={`w-24 mb-3 hover:text-${uiColor} transition-colors duration-150 focus-1-offset-dark ${
              inputMode === "initial" ? "hidden" : ""
            }`}
            aria-label={`${inputMode === "deleteAccount" ? "CONFIRM" : "UPDATE"}`}
            onClick={() => {
              if (passwordCurrent === "") {
                errMessage("Password not provided");
                return;
              }

              // if (name === nameInitial && email === emailInitial) {
              //   setErrorMessage("No new data to update");
              //   setNotification(null);
              //   return;
              // }

              switch (inputMode) {
                case "editProfile":
                  console.log("editProfile");

                  if (username === "") {
                    errMessage("Username cannot be empty");
                    return;
                  }

                  if (email === "") {
                    errMessage("Email cannot be empty");
                    return;
                  }

                  if (email.indexOf("@") === -1) {
                    errMessage("Please enter valid email address");
                    return;
                  }

                  changeUserByUser({
                    id: userId as string,
                    // preventing from trying to update fields without changes
                    name: username === usernameInitial ? null : username,
                    email: email === emailInitial ? null : email,
                    passwordCurrent: passwordCurrent,
                  }).then(
                    async (res) => {
                      if (!res) {
                        errMessage("Server connection Error");
                        return;
                      }

                      if (!res.data?.changeUserByUser?.name) {
                        // if no specific error is received from the server
                        if (!res.data?.changeUserByUser?.error) {
                          errMessage("An unknown error has occured");
                          return;
                        }

                        errMessage(res.data?.changeUserByUser?.error);
                        return;
                      }

                      // if (!res.data?.changeUserByUser?.name) {
                      //   setErrorMessage("Unknown error");
                      //   setNotification(null);
                      //   return;
                      // }

                      reexecuteUserResults({
                        requestPolicy: "network-only",
                      });

                      errMessage(null, false);
                      setNotification("User data successfully updated");
                    },
                    (err) => {
                      console.log(err);
                      errMessage("Server connection Error");
                      return;
                    }
                  );

                  return;
                case "changePassword":
                  console.log("changePassword");

                  if (passwordNew === "") {
                    errMessage("New password not provided");
                    return;
                  }

                  if (passwordNew.length < 8) {
                    errMessage("Password must contain at least 8 characters");
                    return;
                  }

                  if (passwordNewConfirm === "") {
                    errMessage("Password confirmation not provided");
                    return;
                  }

                  if (passwordNew !== passwordNewConfirm) {
                    errMessage("Invalid password confirmation");
                    return;
                  }

                  changePasswordByUser({
                    id: userId as string,
                    passwordCurrent: passwordCurrent,
                    passwordNew: passwordNew,
                  }).then(
                    async (res) => {
                      if (!res) {
                        errMessage("Server connection Error");
                        return;
                      }

                      if (!res.data?.changePasswordByUser?.name) {
                        // if no specific error is received from the server
                        if (!res.data?.changePasswordByUser?.error) {
                          errMessage("An unknown error has occured");
                          return;
                        }

                        errMessage(res.data?.changePasswordByUser?.error);
                        return;
                      }

                      errMessage(null, false);
                      setNotification("Password successfully changed");
                    },
                    (err) => {
                      console.log(err);
                      errMessage("Server connection Error");
                      return;
                    }
                  );

                  return;
                case "deleteAccount":
                  console.log("userId");
                  console.log(userId);
                  console.log("passwordCurrent");
                  console.log(passwordCurrent);

                  deleteAccountByUser({
                    id: userId as string,
                    password: passwordCurrent,
                  }).then(
                    async (res) => {
                      if (!res) {
                        errMessage("Server connection Error");
                        return;
                      }

                      if (!res.data?.deleteAccountByUser?.name) {
                        // if no specific error is received from the server
                        if (!res.data?.deleteAccountByUser?.error) {
                          errMessage("An unknown error has occured");
                          return;
                        }

                        errMessage(res.data?.deleteAccountByUser?.error);
                        return;
                      }

                      errMessage(null);
                      // setLoginNotification("Account successfully deleted");

                      await logoutMut();
                      logout("Account successfully deleted");
                      navigate("/login-register", { replace: true });

                      // upperUiContext.upperVisDispatch({
                      //   type: "MESSAGE_OPEN_LOGIN",
                      // });
                    },
                    (err) => {
                      console.log(err);
                      errMessage("Server connection Error");
                      return;
                    }
                  );

                  console.log("deleteAccount");
                  return;
                default:
                  return;
              }
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
              setUsername(usernameInitial);
              setEmail(emailInitial);
              setPasswordCurrent("");
              errMessage(null);
            }}
            aria-lable="Edit profile"
          >
            Edit profile
          </button>
          <button
            className={`w-36 hover:text-${uiColor} transition-colors duration-150 focus-1-offset-dark ${
              inputMode === "changePassword" ? "hidden" : ""
            }`}
            onClick={() => {
              setInputMode("changePassword");
              setPasswordCurrent("");
              setPasswordNew("");
              setPasswordNewConfirm("");
              errMessage(null);
            }}
            aria-label = "Change password"
          >
            Change password
          </button>
          <button
            className={`w-32 hover:text-${uiColor} transition-colors duration-150 focus-1-offset-dark ${
              inputMode === "deleteAccount" ? "hidden" : ""
            }`}
            onClick={() => {
              setInputMode("deleteAccount");
              setPasswordCurrent("");
              errMessage(null);
            }}
            aria-label="Delete account"
          >
            Delete account
          </button>
        </div>
      </div>

      <div className="flex justify-center">
        <button
          className={`w-24 border border-${uiColor} rounded-md px-1 pb-px hover:bg-${uiColor} hover:bg-opacity-50 transition-colors duration-150
                  focus:outline-none focus-visible:ring-1 ring-${uiColor}`}
          onClick={async () => {
            await logoutMut();

            logout(null);

            navigate("/login-register", { replace: true });
          }}
          aria-label="Logout"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default UserProfile;
