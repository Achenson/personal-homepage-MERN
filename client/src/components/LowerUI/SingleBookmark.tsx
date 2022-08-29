import React, { useEffect, useState } from "react";
import { useMutation } from "urql";

// import shallow from "zustand/shallow";

import Bookmark_newAndEdit from "../Shared/Bookmark_newAndEdit";

import { ReactComponent as PencilSmallSVG } from "../../svgs/pencilSmall.svg";
import { ReactComponent as TrashSmallSVG } from "../../svgs/trashSmall.svg";

// import { useAuthContext } from "../../context/authContext";
import { useAuth } from "../../state/hooks/useAuth";

// import { testUserId } from "../../state/data/testUserId";

// import { ReactComponent as PhotographSVG } from "../../svgs/photograph.svg";

// ====worser
// import { ReactComponent as GlobeSVG } from "../../svgs/test_globe-line-option.svg";
// import { ReactComponent as GlobeSVG } from "../../svgs/test_globe-line.svg";
// import { ReactComponent as GlobeSVG } from "../../svgs/test_internet.svg";
// import { ReactComponent as GlobeSVG } from "../../svgs/test_WEB-conv.svg";
// import { ReactComponent as GlobeSVG } from "../../svgs/test_emblem-web-conv.svg";
// import { ReactComponent as GlobeSVG } from "../../svgs/test_Mappamondo-conv.svg";
// import { ReactComponent as GlobeSVG } from "../../svgs/test_earth-globe-cartoon-2.svg";

// ==== okay
// import { ReactComponent as GlobeSVG } from "../../svgs/globe-alt.svg";
// import { ReactComponent as GlobeSVG } from "../../svgs/test_globe.svg";
// import { ReactComponent as GlobeSVG } from "../../svgs/test_pseudo-globe.svg";
// import { ReactComponent as GlobeSVG } from "../../svgs/test_jongo-jingoro-globe.svg";
// import { ReactComponent as GlobeSVG } from "../../svgs/test_globe-with-ring.svg";
// import { ReactComponent as GlobeSVG } from "../../svgs/photograph.svg";

// ==== best
import { ReactComponent as GlobeSVG } from "../../svgs/internet-web-browser-conv.svg";
// import { ReactComponent as GlobeSVG } from "../../svgs/test_globe-with-meridians.svg";
// import { ReactComponent as GlobeSVG } from "../../svgs/test_globe-svgrepo-com.svg";
// import { ReactComponent as GlobeSVG } from "../../svgs/test_globe-svgrepo-standard.svg";
// import { ReactComponent as GlobeSVG } from "../../svgs/test_svgrepo-blue-white.svg";

// import { useBookmarks } from "../../state/hooks/useBookmarks";
// import { useGlobalSettings } from "../../state/hooks/defaultSettingsHooks";

import { useTabContext } from "../../context/tabContext";
import { useTabs } from "../../state/hooks/useTabs";
import { useUpperUiContext } from "../../context/upperUiContext";
// import { useDbContext } from "../../context/dbContext";
import { useBookmarks } from "../../state/hooks/useBookmarks";
import { useTabsDb } from "../../state/hooks/useTabsDb";
import { useBookmarksDb } from "../../state/hooks/useBookmarksDb";

import {
  ChangeBookmarkMutation,
  DeleteBookmarkMutation,
  DeleteTabMutation,
} from "../../graphql/graphqlMutations";

import { GlobalSettingsState, SingleBookmarkData, SingleTabData } from "../../utils/interfaces";
import { BookmarkDatabase_i } from "../../../../schema/types/bookmarkType";
import { TabDatabase_i } from "../../../../schema/types/tabType";
import { UseGlobalSettingsAll } from "../../state/hooks/defaultSettingsHooks";
import e from "express";

interface Props {
  singleBookmarkData: SingleBookmarkData | BookmarkDatabase_i;
  bookmarkId: string;
  setBookmarkId: React.Dispatch<React.SetStateAction<string | undefined>>;
  colNumber: number;
  tabID: string;
  isTabDraggedOver: boolean;
  globalSettings: GlobalSettingsState;
  userIdOrNoId: string | null;
  tabOpened_local: boolean;
  // bookmarks: SingleBookmarkData[];
  // tabs: SingleTabData[];
}

interface BookmarkId {
  id: string;
}

interface TabId {
  id: string;
}

function SingleBookmark({
  singleBookmarkData,
  bookmarkId,
  setBookmarkId,
  colNumber,
  isTabDraggedOver,
  globalSettings,
  userIdOrNoId,
  tabOpened_local
}: // bookmarks,
// tabs,
Props): JSX.Element {
  // const globalSettings = useGlobalSettings((state) => state, shallow);

  const tabsNotAuth = useTabs((store) => store.tabs);
  const bookmarksNotAuth = useBookmarks((store) => store.bookmarks);
  const editBookmarkNotAuth = useBookmarks((store) => store.editBookmark);

  // const bookmarksDb = useDbContext()?.bookmarks;
  // const tabsDb = useDbContext()?.tabs;

  const tabsDb = useTabsDb((store) => store.tabsDb);
  const bookmarksDb = useBookmarksDb((store) => store.bookmarksDb);

  let bookmarks: BookmarkDatabase_i[] | SingleBookmarkData[];
  let tabs: TabDatabase_i[] | SingleTabData[];

  bookmarks = userIdOrNoId
    ? (bookmarksDb as BookmarkDatabase_i[])
    : bookmarksNotAuth;
  tabs = userIdOrNoId ? (tabsDb as TabDatabase_i[]) : tabsNotAuth;

  // const reexecuteBookmarks = useDbContext()?.reexecuteBookmarks;

  const authContext = useAuth();
  const tabContext = useTabContext();

  const setFocusedTabState = useTabs((store) => store.setFocusedTabState);

  const upperUiContext = useUpperUiContext();

  // const setTabDeletingPause = useTabs((store) => store.setTabDeletingPause);

  // const bookmarks = useBookmarks((state) => state.bookmarks);
  // const tabs = useTabs((state) => state.tabs);
  const deleteBookmarkNotAuth = useBookmarks((store) => store.deleteBookmark);
  const deleteTabNotAuth = useTabs((store) => store.deleteTab);
  const getTabsToDelete = useBookmarks((store) => store.getTabsToDelete);

  const [deleteBookmarkResult, deleteBookmark] = useMutation<any, BookmarkId>(
    DeleteBookmarkMutation
  );

  const [changeBookmarkResutl, changeBookmark] = useMutation<
    any,
    BookmarkDatabase_i
  >(ChangeBookmarkMutation);

  const [deleteTabResult, deleteTab] = useMutation<any, TabId>(
    DeleteTabMutation
  );

  // const [favicon, setFavicon] = useState<string | null>(null);

  // let userIdOrDemoId: string;
  // userIdOrDemoId =
  //   authContext.authenticatedUserId && authContext.isAuthenticated
  //     ? authContext.authenticatedUserId
  //     : testUserId;

  // const [isFaviconDefault, setIsFaviconDefault] = useState(false);

  // useEffect(() => {
  //   fetch(
  //     "http://localhost:4000/favicon/" +
  //       encodeURIComponent(singleBookmarkData.URL),
  //     {
  //       method: "GET",
  //     }
  //   )
  //     .then((res) => res.json())
  //     .then((res) => {
  //       setFavicon(res);
  //     });
  // }, [singleBookmarkData.URL]);

  let urlParse = new URL(singleBookmarkData.URL);
  // will replace only the first occurence of www.
  // let domain = urlParse.hostname
  let domain = urlParse.hostname.replace("www.", "");

  let faviconUrlApi_domain = "https://icon.horse/icon/" + domain;

  /*  
    
    ============= google API -> low quality
    let faviconUrlApi_google =
    "https://www.google.com/s2/favicons?domain=" + singleBookmarkData.URL;

    ===== domain will be parsed from url automatically by icon horse, BUT the fallback will still
    be from the address, so usually all fallbacks would be the same ("W") - unwanted behavior

    let faviconUrlApi = "https://icon.horse/icon?uri=" + singleBookmarkData.URL; */

  function deleteTabsLogicNotAuth(
    tabIDsToDelete: string[],
    tabs: SingleTabData[]
  ) {
    for (let tabID of tabIDsToDelete) {
      if (!tabs.filter((el) => el.id === tabID)[0].deletable) {
        continue;
      }

      deleteTabNotAuth(tabID);
    }
  }

  async function deleteTabsLogicDb(
    tabIDsToDelete: string[],
    tabs: TabDatabase_i[]
  ) {
    for (let tabID of tabIDsToDelete) {
      // if (tabID === "ALL_TAGS") {
      //   continue;
      // }

      if (!tabs.filter((el) => el.id === tabID)[0]?.deletable) {
        continue;
      }

      await deleteTab({ id: tabID }).then((result) => {
        console.log(result);
      });
      // no logic for deletings tags in other bookmarks this time,
      // because other bookmars should not contain this tag anymore
    }
  }

  return (
    <div
    className={`${tabOpened_local ? "visible" : "hidden"}`}
      onFocus={() => {
        setFocusedTabState(null);
      }}
    >
      {tabContext.tabVisState.editBookmarkVis !== bookmarkId && (
        <div
          className={`flex justify-between ${
            isTabDraggedOver ? "bg-gray-200" : "bg-gray-50"
          } h-10 pt-2 border border-t-0 ${
            globalSettings.picBackground ? "" : "border-black border-opacity-10"
          }`}
        >
          <div className="flex truncate">
            <div className="flex justify-center items-center h-6 w-6 mr-px mt-px">
              {singleBookmarkData.defaultFaviconFallback ? (
                <GlobeSVG
                  // @ts-ignore

                  // className="h-full"
                  // @ts-ignore
                  className="fill-current text-blue-800 cursor-pointer"
                  // className="fill-current text-blueGray-500"
                  onClick={() => {
                    // setIsFaviconDefault(b=>!b)
                    console.log("clicked");
                    console.log(singleBookmarkData.defaultFaviconFallback);

                    userIdOrNoId
                      ? changeBookmark({
                          ...singleBookmarkData,
                          userId: authContext.authenticatedUserId as string,
                          defaultFaviconFallback:
                            !singleBookmarkData.defaultFaviconFallback,
                        })
                      : editBookmarkNotAuth(
                          singleBookmarkData.id,
                          singleBookmarkData.title,
                          singleBookmarkData.URL,
                          singleBookmarkData.tags,
                          !singleBookmarkData.defaultFaviconFallback
                        );
                  }}
                  /* style={{
                    height: "15px",
                    width: "15px",
                  }} */
                  style={{
                    height: "15px",
                    width: "15px",
                  }}
                />
              ) : (
                <img
                  src={faviconUrlApi_domain}
                  // src={singleBookmarkData.URL === "https://www.metacritic.com/" ? faviconUrlApi2 : faviconUrlApi}
                  className="cursor-pointer"
                  style={{
                    height: "15px",
                    width: "15px",
                  }}
                  onClick={() => {
                    // setIsFaviconDefault(b=>!b)
                    console.log("clicked2");
                    console.log(singleBookmarkData.defaultFaviconFallback);

                    userIdOrNoId
                      ? changeBookmark({
                          ...singleBookmarkData,
                          userId: authContext.authenticatedUserId as string,
                          defaultFaviconFallback:
                            !singleBookmarkData.defaultFaviconFallback,
                        })
                      : editBookmarkNotAuth(
                          singleBookmarkData.id,
                          singleBookmarkData.title,
                          singleBookmarkData.URL,
                          singleBookmarkData.tags,
                          !singleBookmarkData.defaultFaviconFallback
                        );

                    // changeBookmark({
                    //   ...singleBookmarkData,
                    //   userId: userIdOrDemoId,
                    //   defaultFaviconFallback:
                    //     !singleBookmarkData.defaultFaviconFallback,
                    // });
                  }}
                />
              )}

              {/*  <div style={{
                backgroundImage: faviconUrlApi,
                height: "15px",
                width: "15px"
                
              }}></div> */}
            </div>
            <div className="truncate">
              <a
                href={singleBookmarkData.URL}
                target="_blank"
                rel="noopener noreferrer"
                className="z-50 hover:text-gray-600 transition-colors duration-75 focus-1-darkGray mx-0.5"
              >
                {singleBookmarkData.title}
              </a>
            </div>
          </div>
          <div
            className="flex fill-current text-gray-500"
            style={{ marginTop: "2px" }}
          >
            <button
              className="h-5 w-5 ml-1 focus-1-inset-darkGray"
              onClick={() => {
                tabContext.tabVisDispatch({
                  type: "EDIT_BOOKMARK_OPEN",
                  payload: bookmarkId,
                });
                upperUiContext.upperVisDispatch({ type: "CLOSE_ALL" });
                setBookmarkId(singleBookmarkData.id);
              }}
              aria-label={"Edit bookmark"}
            >
              <PencilSmallSVG className="h-full w-full transition-colors duration-75 hover:text-black cursor-pointer" />
            </button>

            <button
              className="h-5 w-5 ml-1 focus-1-inset-darkGray"
              onClick={async () => {
                /*       let bookmarkToDelete = bookmarks.find(
                  (obj) => obj.id === bookmarkId
                );

                if (bookmarkToDelete) {
                  deleteBookmark(
                    bookmarkId,
                    singleBookmarkData,
                    tabs.find((obj) => !obj.deletable)?.id as string
                  );
                } */

                if (!userIdOrNoId) {
                  let bookmarkToDelete = bookmarks.find(
                    (obj) => obj.id === bookmarkId
                  );

                  if (bookmarkToDelete) {
                    let tabIdsToDelete = getTabsToDelete(bookmarkToDelete.id, bookmarkToDelete.tags);

                    if (tabIdsToDelete.length === 0) {
                      deleteBookmarkNotAuth(bookmarkId, singleBookmarkData);
                      return;
                    }

                    deleteTabsLogicNotAuth(
                      tabIdsToDelete,
                      tabs as SingleTabData[]
                    );
                    deleteBookmarkNotAuth(bookmarkId, singleBookmarkData);
                  }

                  return;
                }

                function getTabsToDeleteDb(bookmarkIdToDelete: string) {
                  // should contain all tags, but without the tags present in bookmark to del
                  let arrOfTags: string[] = [];

                  let bmarksWithoutBkmarkToDel: BookmarkDatabase_i[] = (
                    bookmarks as BookmarkDatabase_i[]
                  ).filter((el) => el.id !== bookmarkIdToDelete);

                  // pushing unique tags to arrOfAllTags
                  for (let bmark of bmarksWithoutBkmarkToDel) {
                    for (let tag of bmark.tags) {
                      if (arrOfTags.indexOf(tag) === -1) {
                        arrOfTags.push(tag);
                      }
                    }
                  }
                  // first item in the arr is bookmark to delete
                  let bookmarkToDeleteArr: BookmarkDatabase_i[] = (
                    bookmarks as BookmarkDatabase_i[]
                  ).filter((el) => el.id === bookmarkIdToDelete);

                  let tagsToDelete: string[] = [];

                  // if one of the tag(tab) of bookmark to del is not present is all tags -> this tags (tabs) to delete
                  for (let tag of bookmarkToDeleteArr[0].tags) {
                    if (arrOfTags.indexOf(tag) === -1) {
                      tagsToDelete.push(tag);
                    }
                  }

                  return tagsToDelete;
                }

                let tabIdsToDelete = getTabsToDeleteDb(bookmarkId);

                if (tabIdsToDelete.length === 0) {
                  await deleteBookmark({ id: bookmarkId }).then((result) =>
                    console.log(result)
                  );
                  return;
                }

                await deleteTabsLogicDb(
                  tabIdsToDelete,
                  tabs as TabDatabase_i[]
                );

                await deleteBookmark({ id: bookmarkId }).then((result) =>
                  console.log(result)
                );

                // reexecuteBookmarks({ requestPolicy: 'network-only' })
                /* setTimeout(() => {
                  setTabDeletingPause(false);
                }, 500); */

                // setTabDeletingPause(false);
              }}
              aria-label={"Delete bookmark"}
            >
              <TrashSmallSVG className="h-full w-full transition-colors duration-75 hover:text-black cursor-pointer" />
            </button>
          </div>
        </div>
      )}

      {tabContext.tabVisState.editBookmarkVis === bookmarkId && (
        <Bookmark_newAndEdit
          bookmarkComponentType="edit"
          colNumber={colNumber}
          bookmarkId={bookmarkId as string}
          // bookmarks={bookmarks}
          // tabs={tabs}
          globalSettings={globalSettings}
          userIdOrNoId={userIdOrNoId}
        />
      )}
    </div>
  );
}

export default SingleBookmark;
