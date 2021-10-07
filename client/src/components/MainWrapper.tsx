import React from "react";
import { useQuery } from "urql";

import Main from "./Main";

import { SettingsQuery } from "../graphql/graphqlQueries";
import { testUserId } from "../state/data/testUserId";

import { SettingsDatabase_i } from "../../../schema/types/settingsType";

// component purpose: to provide globalSetting as a prop, because
// in Main a useEffect depends on it - globalSettins needs to be defined right away
function MainWrapper(): JSX.Element {
  const [settingsResults] = useQuery({
    query: SettingsQuery,
    variables: { userId: testUserId },
  });

  const { data, fetching, error } = settingsResults;

  if (fetching) return <p>Loading...</p>;
  if (error) return <p>Oh no... {error.message}</p>;

  let globalSettings: SettingsDatabase_i = data.settings;

  return <Main globalSettings={globalSettings} />;
}

export default MainWrapper;
