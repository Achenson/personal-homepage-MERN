import React, { useState } from "react";

// import shallow from "zustand/shallow";
// import { useQuery as useReactQuery } from "react-query";
import { useQuery } from "urql";

import SingleRssNews from "./SingleRssNews";

import { ReactComponent as ArrowLeft } from "../../svgs/arrowLeft.svg";
import { ReactComponent as ArrowRight } from "../../svgs/arrowRight.svg";

import { RssFetchQuery } from "../../graphql/graphqlQueries";
import { rssExample } from "../../utils/data/rssExample";

// import { useGlobalSettings } from "../../state/hooks/defaultSettingsHooks";
// import { useRssSettings } from "../../state/hooks/defaultSettingsHooks";

import { SettingsDatabase_i } from "../../../../schema/types/settingsType";
import { SingleTabData } from "../../utils/interfaces";

let Parser = require("rss-parser");
let parser = new Parser();

interface Props {
  tabID: string;
  currentTab: SingleTabData;
  isTabDraggedOver: boolean;
  globalSettings: SettingsDatabase_i;
}

function ReactQuery({
  currentTab,
  tabID,
  isTabDraggedOver,
  globalSettings,
}: Props): JSX.Element {
  // const globalSettings = useGlobalSettings((state) => state, shallow);
  // const rssSettingsState = useRssSettings((state) => state, shallow);

  function calcItemsPerPage() {
    // if currentBookmars itemsPerPage is set, return it, otherwise
    // return defaul option for RSS setting

    if (typeof currentTab?.itemsPerPage === "number") {
      return currentTab.itemsPerPage;
    }

    return globalSettings.itemsPerPage;
  }

  function calcDescriptionVis() {
    if (typeof currentTab?.description === "boolean") {
      return currentTab.description;
    }

    return globalSettings.description;
  }

  function calcDateVis() {
    if (typeof currentTab?.date === "boolean") {
      return currentTab.date;
    }

    return globalSettings.date;
  }

  let itemsPerPage = calcItemsPerPage();
  let descriptionVis = calcDescriptionVis();
  let dateVis = calcDateVis();

  const [pageNumber, setPageNumber] = useState(0);

  // const { data, status } = useReactQuery(`${tabID}`, fetchFeed, {
  //   // staleTime: 2000,
  //   // cacheTime: 10,
  //   onSuccess: () => {
  //     console.log("data fetched with no problems");
  //     // console.log(data);
  //   },
  // });

  const [rssFetchResults, reexecuteRssFetch] = useQuery({
    query: RssFetchQuery,
    // variables: { userId: authContext.isAuthenticated ? authContext.authenticatedUserId : testUserId },
    variables: { rssLink: currentTab.rssLink },
    // requestPolicy: 'cache-and-network',
  });

  const { data, fetching, error } = rssFetchResults;

  console.log(currentTab.rssLink);
  console.log(data);

  let rssData: any;
  // let rssData = data.rssFetch.rssFetchData;

  if (data && data.rssFetch) {
    rssData = data.rssFetch.rssFetchData;
  } 
  
  // else {
  //   rssData = rssExample.data.rssFetch.rssFetchData;
  // }

  // async function fetchFeed() {

  //   let baseFetchUrl = "http://localhost:4000/fetch_rss/";
  //   let extendedRSSurl = `${currentTab.rssLink}?format=xml`;

  //   try {
  //     // let response = await parser.parseURL(currentTab?.rssLink);
  //     // return response;
  //     let toSendUrl = encodeURIComponent(`${currentTab.rssLink}`);

  //     let response = await fetch(baseFetchUrl + toSendUrl);

  //     if (!response.ok) {
  //       throw new Error("Network response was not ok");
  //     }

  //     return response.json();
  //   } catch (err) {
  //     // let newResponse = await parser.parseURL(extendedRSSurl);
  //     // return newResponse;
  //     let newToSendUrl = encodeURIComponent(extendedRSSurl);

  //     let newResponse = await fetch(baseFetchUrl + newToSendUrl);

  //     if (!newResponse.ok) {
  //       throw new Error("Network response was not ok");
  //     }

  //     return newResponse.json();
  //   }
  // }

  function mapData() {
    let arrOfObj = [];

    let howManyNews = rssData.items.length;

    for (
      let i = pageNumber * itemsPerPage;
      i < pageNumber * itemsPerPage + itemsPerPage;
      i++
    ) {
      if (i > howManyNews) {
        break;
      }

      if (rssData.items[i]) {
        arrOfObj.push(rssData.items[i]);
        continue;
      }
      break;
    }

    function convertRssDate(pubDate: string) {
      let date = new Date(pubDate);
      if (!date || !date.getDay() || !date.getMonth()) {
        return "date unknown";
      }
      // let dateShorter = new Date(date.getFullYear(), date.getMonth(), date.getDate())
      let dateNow = new Date();
      // let dateNowShorter = new Date(dateNow.getFullYear(), dateNow.getMonth(), dateNow.getDate())

      let date_day = date.getDate();
      let dateNow_day = dateNow.getDate();

      if (date_day === dateNow_day) {
        return "today";
      }

      if (date_day + 1 === dateNow_day) {
        return "yesterday";
      }

      for (let i = 2; i <= 31; i++) {
        if (date_day + i === dateNow_day) {
          return `${i} days ago`;
        }
      }

      return "older than a month";
    }

    return arrOfObj.map((el, i) => (
      <SingleRssNews
        title={el.title}
        description={el.contentSnippet}
        descriptionVis={descriptionVis}
        dateVis={dateVis}
        link={el.link}
        key={i}
        pubDate={convertRssDate(el.pubDate)}
        isTabDraggedOver={isTabDraggedOver}
        globalSettings={globalSettings}
      />
    ));
  }

  function lastPageNumber() {
    // if (status !== "success") {
    if (!rssData) {
      return 1;
    }

    let howManyNews = rssData.items.length;

    let maxNumber = howManyNews < 50 ? howManyNews : 50;

    return Math.ceil(maxNumber / itemsPerPage) - 1;
  }

  return (
    <div>
      <div
        className={`flex ${
          isTabDraggedOver ? "bg-gray-200" : "bg-gray-50"
        } justify-end border-r border-l
    ${globalSettings.picBackground ? "" : "border-black border-opacity-10"}`}
      >
        <button
          className="focus-2-inset"
          onClick={() => {
            if (pageNumber > 0) {
              setPageNumber(pageNumber - 1);
            }
          }}
          aria-label={"Previous page"}
        >
          <ArrowLeft
            className={`h-8 ${
              pageNumber === 0
                ? `text-gray-400`
                : `cursor-pointer text-black hover:bg-gray-200`
            }`}
          />
        </button>

        <button
          className="focus-2-inset"
          onClick={() => {
            if (pageNumber < lastPageNumber()) {
              setPageNumber(pageNumber + 1);
            }
          }}
          aria-label={"Next page"}
        >
          <ArrowRight
            className={`h-8 ${
              pageNumber === lastPageNumber()
                ? `text-gray-400`
                : `cursor-pointer text-black hover:bg-gray-200`
            }`}
          />
        </button>
      </div>
      <div
        className={`text-center
    ${
      globalSettings.picBackground
        ? "bg-white bg-opacity-90 border-r border-l"
        : "border-r border-l border-black border-opacity-10"
    }`}
      >
        {fetching && <div>Loading data...</div>}

        {error && <div>Error fetching data</div>}
      </div>

      {rssData && <div>{mapData()}</div>}
    </div>
  );
}

export default ReactQuery;
