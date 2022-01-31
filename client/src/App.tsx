import React, { useEffect } from "react";
// import { DndProvider } from "react-dnd";
import { DndProvider } from "react-dnd-multi-backend";
import HTML5toTouch from "react-dnd-multi-backend/dist/esm/HTML5toTouch";
import {
  createClient,
  Provider,
  dedupExchange,
  cacheExchange,
  fetchExchange,
} from "urql";
import { QueryClientProvider, QueryClient } from "react-query";
import { authExchange } from "@urql/exchange-auth";
import { makeOperation } from "@urql/core";
import jwtDecode from "jwt-decode";

import { useAuthContext } from "./context/authContext";

import MainWrapper from "./components/MainWrapper";

interface AuthState {
  // userId: string | null;
  accessToken: string | null;
}

interface AuthToOperation {
  authState: AuthState;
  operation: any;
}

const environment = process.env.NODE_ENV;

let graphqlUri: string;

if (environment === "production") {
  graphqlUri = "/graphql";
} else {
  graphqlUri = "http://localhost:4000/graphql";
}

let refreshTokenUri: string;

if (environment === "production") {
  refreshTokenUri = "/refresh_token";
} else {
  refreshTokenUri = "http://localhost:4000/refresh_token";
}

// import { HTML5Backend } from "react-dnd-html5-backend";
// import { TouchBackend } from 'react-dnd-touch-backend';

// import { ReactQueryDevtools} from "react-query-devtools";

const queryClient = new QueryClient();

function App() {
  const authContext = useAuthContext();

  useEffect( () => {


    console.log("authContext.isAuthenticated");
    console.log(authContext.isAuthenticated);
    
  }, [authContext.isAuthenticated])

  const client = createClient({
    url: "http://localhost:4000/graphql",
    exchanges: [
      dedupExchange,
      cacheExchange,
      authExchange({
        addAuthToOperation: ({ authState, operation }: AuthToOperation) => {
          //if the token isn't in the auth state, return the operation without changes
          if (!authState || !authState.accessToken) {
            return operation;
          }

          const fetchOptions =
            typeof operation.context.fetchOptions === "function"
              ? operation.context.fetchOptions()
              : operation.context.fetchOptions || {};

          return makeOperation(operation.kind, operation, {
            ...operation.context,
            fetchOptions: {
              ...fetchOptions,
              headers: {
                ...fetchOptions.headers,
                // Authorization: authState.accessToken,
                Authorization: `Bearer ${authState.accessToken}`,
              },
            },
          });
        },
        getAuth: async ({ authState, mutate }) => {
          // for initial launch, fetch the auth state from central state (react context in AppWrapper)

          // "We check that the authState doesn't already exist (this indicates that it is the first time
          // this exchange is executed and not an auth failure) "
          if (!authState) {
            // const accessToken = localStorage.getItem("token");
            const accessToken = authContext.accessToken;
            // const refreshToken = localStorage.getItem("refreshToken");
            if (accessToken) {
              // ====== checking if accessToken is expired
              try {
                // @ts-ignore
                const { exp } = jwtDecode(accessToken);
                if (Date.now() >= exp * 1000) {
                  refreshToken();
                } else {
                  return { accessToken };
                }
              } catch {
                refreshToken();
              }

              return { accessToken };
            }
            return null;
          }

          /**
           * the following code gets executed when an auth error has occurred
           * we should refresh the token if possible and return a new auth state
           * If refresh fails, we should log out
           **/

          refreshToken();

          function refreshToken() {
            fetch(`${refreshTokenUri}`, {
              method: "POST",
              credentials: "include",
            })
              .then((res) => res.json())
              .then((res) => {
                console.log(res);

                // (if case of failure, this will be a logout logic)
                authContext.updateAuthContext({
                  ...authContext,
                  isAuthenticated: res.ok,
                  accessToken: res.accessToken,
                  authenticatedUserId: res.userId,
                  /* isAuthenticated: authContext.isAuthenticated,
                    authenticatedUserId: authContext.authenticatedUserId,
                    accessToken: authContext.accessToken,
                    loginNotification: authContext.loginNotification,
                    loginErrorMessage: authContext.loginErrorMessage
                     */
                });

                // accessToken will be an empty string in case of failure!!
                return { accessToken: res.accessToken as string };
              });
          }

          return null;
        },
      }),
      fetchExchange,
    ],
    fetchOptions: {
      // !!!! whitout this line cookie will not be set clientside
      credentials: "include",
    },
  });

  return (
    <Provider value={client}>
      <QueryClientProvider client={queryClient}>
        <div className="App">
          {/* <DndProvider backend={HTML5Backend}> */}
          <DndProvider options={HTML5toTouch}>
            <MainWrapper />
          </DndProvider>
        </div>
        {/* <ReactQueryDevtools initialIsOpen={false} /> */}
      </QueryClientProvider>
    </Provider>
  );
}

export default App;
