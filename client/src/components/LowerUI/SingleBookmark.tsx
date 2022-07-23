import React, { useEffect, useState } from "react";
import { useMutation } from "urql";

// import shallow from "zustand/shallow";

import Bookmark_newAndEdit from "../Shared/Bookmark_newAndEdit";

import { ReactComponent as PencilSmallSVG } from "../../svgs/pencilSmall.svg";
import { ReactComponent as TrashSmallSVG } from "../../svgs/trashSmall.svg";

// import { useAuthContext } from "../../context/authContext";
import { useAuth } from "../../state/hooks/useAuth";

import { testUserId } from "../../state/data/testUserId";

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
import { ReactComponent as GlobeSVG } from "../../svgs/test_internet-web-browser-conv.svg";
// import { ReactComponent as GlobeSVG } from "../../svgs/test_globe-with-meridians.svg";
// import { ReactComponent as GlobeSVG } from "../../svgs/test_globe-svgrepo-com.svg";
// import { ReactComponent as GlobeSVG } from "../../svgs/test_globe-svgrepo-standard.svg";
// import { ReactComponent as GlobeSVG } from "../../svgs/test_svgrepo-blue-white.svg";

// import { useBookmarks } from "../../state/hooks/useBookmarks";
// import { useGlobalSettings } from "../../state/hooks/defaultSettingsHooks";

import { useTabContext } from "../../context/tabContext";
import { useTabs } from "../../state/hooks/useTabs";
import { useUpperUiContext } from "../../context/upperUiContext";
import { useDbContext } from "../../context/dbContext";
import { useBookmarks } from "../../state/hooks/useBookmarks";

import {
  ChangeBookmarkMutation,
  DeleteBookmarkMutation,
  TestMutation,
} from "../../graphql/graphqlMutations";

import { SingleBookmarkData, SingleTabData } from "../../utils/interfaces";
import { SettingsDatabase_i } from "../../../../schema/types/settingsType";
import { BookmarkDatabase_i } from "../../../../schema/types/bookmarkType";
import { TabDatabase_i } from "../../../../schema/types/tabType";
import { UseGlobalSettingsAll } from "../../state/hooks/defaultSettingsHooks";
import e from "express";

interface Props {
  singleBookmarkData: SingleBookmarkData;
  bookmarkId: string;
  setBookmarkId: React.Dispatch<React.SetStateAction<string | undefined>>;
  colNumber: number;
  tabID: string;
  isTabDraggedOver: boolean;
  globalSettings: SettingsDatabase_i | UseGlobalSettingsAll;
  userIdOrNoId: string | null;
  // bookmarks: SingleBookmarkData[];
  // tabs: SingleTabData[];
}

interface BookmarkId {
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
}: // bookmarks,
// tabs,
Props): JSX.Element {
  // const globalSettings = useGlobalSettings((state) => state, shallow);

  const tabsNotAuth = useTabs((store) => store.tabs);
  const bookmarksNotAuth = useBookmarks((store) => store.bookmarks);
  const editBookmarkNonAuth = useBookmarks((store) => store.editBookmark);

  const bookmarksDb = useDbContext()?.bookmarks;
  const tabsDb = useDbContext()?.tabs;

  let bookmarks: BookmarkDatabase_i[] | SingleBookmarkData[];
  let tabs: TabDatabase_i[] | SingleTabData[];

  bookmarks = userIdOrNoId
    ? (bookmarksDb as SingleBookmarkData[])
    : bookmarksNotAuth;
  tabs = userIdOrNoId ? (tabsDb as TabDatabase_i[]) : tabsNotAuth;

  const reexecuteBookmarks = useDbContext()?.reexecuteBookmarks;

  const authContext = useAuth();
  const tabContext = useTabContext();

  const setFocusedTabState = useTabs((store) => store.setFocusedTabState);

  const upperUiContext = useUpperUiContext();

  const setTabDeletingPause = useTabs((store) => store.setTabDeletingPause);

  // const bookmarks = useBookmarks((state) => state.bookmarks);
  // const tabs = useTabs((state) => state.tabs);
  const deleteBookmarkNonAuth = useBookmarks((store) => store.deleteBookmark);

  const [deleteBookmarkResult, deleteBookmark] = useMutation<any, BookmarkId>(
    DeleteBookmarkMutation
  );

  const [changeBookmarkResutl, changeBookmark] = useMutation<
    any,
    BookmarkDatabase_i
  >(ChangeBookmarkMutation);

  // const [favicon, setFavicon] = useState<string | null>(null);

  const [testMutationResult, testMutation] = useMutation<any, any>(
    TestMutation
  );

  let userIdOrDemoId: string;
  userIdOrDemoId =
    authContext.authenticatedUserId && authContext.isAuthenticated
      ? authContext.authenticatedUserId
      : testUserId;

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

  return (
    <div
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
                    // testMutation({stringToAdd: "string to add"})

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
                      : editBookmarkNonAuth(
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
                      : editBookmarkNonAuth(
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
              {/*       <PhotographSVG
                className="h-full"
                onClick={() => {
                  // testMutation({stringToAdd: "string to add"})
                }}
              /> */}

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
                    deleteBookmarkNonAuth(bookmarkId, singleBookmarkData);
                  }

                  return;
                }

                console.log(singleBookmarkData.title);
                console.log(bookmarkId);

                await deleteBookmark({ id: bookmarkId }).then((result) =>
                  console.log(result)
                );

                // reexecuteBookmarks({ requestPolicy: 'network-only' })
                /* setTimeout(() => {
                  setTabDeletingPause(false);
                }, 500); */

                setTabDeletingPause(false);
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
