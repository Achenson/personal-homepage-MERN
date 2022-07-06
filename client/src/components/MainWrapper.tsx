import React from "react";
import { useQuery } from "urql";
import shallow from "zustand/shallow";

import Main from "./Main";

import { SettingsQuery } from "../graphql/graphqlQueries";
import { testUserId } from "../state/data/testUserId";
// import { useAuthContext } from "../context/authContext";
import { useAuth } from "../state/hooks/useAuth";
import { useGlobalSettings } from "../state/hooks/defaultSettingsHooks";


import { SettingsDatabase_i } from "../../../schema/types/settingsType";

// component purpose: to provide globalSetting as a prop, because
// in Main a useEffect depends on it - globalSettins needs to be defined right away
function MainWrapper(): JSX.Element {
  const authContext = useAuth();
  const globalSettingsNotAuth = useGlobalSettings((state) => state, shallow);

  let userIdOrNoId: string | null;

  userIdOrNoId =
    authContext.isAuthenticated && authContext.authenticatedUserId
      ? authContext.authenticatedUserId
      : null;

  const [settingsResults] = useQuery({
    query: SettingsQuery,
    variables: { userId: userIdOrNoId},
    pause: !userIdOrNoId
  });

  const { data, fetching, error } = settingsResults;

  if (fetching) return <p>Loading...</p>;
  if (error) return <p>Oh no... {error.message}</p>;

  // let globalSettings: SettingsDatabase_i = data.settings;
  let globalSettings: SettingsDatabase_i;

  globalSettings = userIdOrNoId ? data.settings : globalSettingsNotAuth

  return <Main globalSettings={globalSettings} />;
}

export default MainWrapper;
