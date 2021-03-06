import React, { useEffect, useRef } from "react";
import { useMutation } from "urql";
import FocusLock from "react-focus-lock";

import SelectableList from "../Shared/SelectableList";
import BookmarkErrors_render from "../Shared/BookmarkErrors_render";

import { ReactComponent as SaveSVG } from "../../svgs/save.svg";
import { ReactComponent as CancelSVG } from "../../svgs/alphabet-x.svg";
import { ReactComponent as CheckSVG } from "../../svgs/check-small.svg";
import { ReactComponent as XsmallSVG } from "../../svgs/x-small.svg";
import { ReactComponent as ChevronDownSVG } from "../../svgs/chevron-down.svg";
import { ReactComponent as ChevronUpSVG } from "../../svgs/chevron-up.svg";

import { useBookmarks } from "../../state/hooks/useBookmarks";
import { useTabs } from "../../state/hooks/useTabs";
import { useDbContext } from "../../context/dbContext";
// import { useDefaultColors } from "../../state/hooks/colorHooks";

import {
  // createBookmark,
  createFolderTab,
  createBookmarkDb,
  createFolderTabDb,
  createBookmarkNonAuth,
} from "../../utils/funcs and hooks/objCreators";
import { useUpperUiContext } from "../../context/upperUiContext";
import { bookmarkErrorHandling } from "../../utils/funcs and hooks/bookmarkErrorHandling";
import { handleKeyDown_inner } from "../../utils/funcs and hooks/handleKeyDown_bookmarksAndTabs";
import {
  AddBookmarkMutation,
  AddTabMutation,
} from "../../graphql/graphqlMutations";

import { UseGlobalSettingsAll } from "../../state/hooks/defaultSettingsHooks";

import {
  BookmarkErrors,
  SetBookmarkErrors,
  SingleBookmarkData,
  SingleTabData,
} from "../../utils/interfaces";
import { SettingsDatabase_i } from "../../../../schema/types/settingsType";
import { TabDatabase_i } from "../../../../schema/types/tabType";
import { BookmarkDatabase_i } from "../../../../schema/types/bookmarkType";

interface Props {
  titleInput: string;
  setTitleInput: React.Dispatch<React.SetStateAction<string>>;
  urlInput: string;
  setUrlInput: React.Dispatch<React.SetStateAction<string>>;
  selectablesInputStr: string;
  setSelectablesInputStr: React.Dispatch<React.SetStateAction<string>>;
  visibleTags: string[];
  setVisibleTags: React.Dispatch<React.SetStateAction<string[]>>;
  initialTags: string[];
  selectablesListVis: boolean;
  setSelectablesListVis: React.Dispatch<React.SetStateAction<boolean>>;
  notesTitlesArr: string[];
  rssTitlesArr: string[];
  bookmarkComponentType: "new_upperUI" | "new_lowerUI" | "edit";
  errors: BookmarkErrors;
  setErrors: SetBookmarkErrors;
  mainPaddingRight: boolean;
  scrollbarWidth: number;
  // bookmarks: SingleBookmarkData[];
  // tabs: SingleTabData[];
  globalSettings: SettingsDatabase_i | UseGlobalSettingsAll;
  userIdOrNoId: string | null;
}

function NewBookmark_UpperUI({
  titleInput,
  setTitleInput,
  urlInput,
  setUrlInput,
  selectablesInputStr,
  setSelectablesInputStr,
  visibleTags,
  initialTags,
  selectablesListVis,
  setSelectablesListVis,
  notesTitlesArr,
  rssTitlesArr,
  errors,
  setErrors,
  mainPaddingRight,
  scrollbarWidth,
  // bookmarks,
  // tabs,
  globalSettings,
  userIdOrNoId,
}: Props): JSX.Element {
  // const tabs = useTabs((store) => store.tabs);

  const tabsNotAuth = useTabs((store) => store.tabs);
  const bookmarksNotAuth = useBookmarks((store) => store.bookmarks);

  const bookmarksDb = useDbContext()?.bookmarks;
  const tabsDb = useDbContext()?.tabs;

  let bookmarks: BookmarkDatabase_i[] | SingleBookmarkData[];
  let tabs: TabDatabase_i[] | SingleTabData[];

  bookmarks = userIdOrNoId
    ? (bookmarksDb as SingleBookmarkData[])
    : bookmarksNotAuth;
  tabs = userIdOrNoId ? (tabsDb as TabDatabase_i[]) : tabsNotAuth;

  // const bookmarks = useDbContext().bookmarks;
  const reexecuteBookmarks = useDbContext()?.reexecuteBookmarks;
  // const tabs = useDbContext().tabs;
  const addTabsNonAuth = useTabs((store) => store.addTabs);
  const [addTabResult, addTab] = useMutation<any, TabDatabase_i>(
    AddTabMutation
  );

  const [addBookmarkResult, addBookmark] = useMutation<any, BookmarkDatabase_i>(
    AddBookmarkMutation
  );

  // const bookmarks = useBookmarks((store) => store.bookmarks);
  const bookmarksAllTags = useBookmarks((store) => store.bookmarksAllTags);
  // const bookmarksAllTags: string[] = bookmarks.map((obj) => obj.id);
  const setBookmarksAllTags = useBookmarks(
    (store) => store.setBookmarksAllTags
  );
  const addBookmarkNonAuth = useBookmarks((store) => store.addBookmark);

  // const uiColor = useDefaultColors((state) => state.uiColor);
  const uiColor = globalSettings.uiColor;

  const upperUiContext = useUpperUiContext();

  let selectablesRef = useRef<HTMLInputElement>(null);
  let firstFieldRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  });

  useEffect(() => {
    if (firstFieldRef.current !== null) {
      firstFieldRef.current.focus();
    }
  }, []);

  let tagsInputArr: string[] = selectablesInputStr.split(", ");

  let selectablesInputStr_noComma: string;

  if (selectablesInputStr[selectablesInputStr.length - 1] === ",") {
    selectablesInputStr_noComma = selectablesInputStr.slice(
      0,
      selectablesInputStr.length - 1
    );
    tagsInputArr = selectablesInputStr_noComma.split(", ");
  }

  async function addBookmarkWrapper() {
    // all tags always being added
    // let tagsInputArr_ToIds: string[] = ["ALL_TAGS"];
    let tagsInputArr_ToIds: string[] = [
      tabs.find((obj) => !obj.deletable)?.id as string,
    ];

    // let newTabsToAdd: SingleTabData[] = [];
    let newTabsToAdd: TabDatabase_i[] | SingleTabData[] = [];

    // nonAuth
    let newBookmarksAllTagsData = [...bookmarksAllTags];

    // getting higher priority for each subsequent tab that is being added at the same time
    let counterForIndices = 0;

    tagsInputArr.forEach((el) => {
      let tabCorrespondingToTag = tabs.find((obj) => obj.title === el);

      let sortedTabsInCol = tabs
        .filter((obj) => obj.column === 1)
        .sort((a, b) => a.priority - b.priority);

      let newTabPriority =
        sortedTabsInCol[sortedTabsInCol.length - 1].priority +
        1 +
        counterForIndices;

      // if folder with title corresponding to tag doesn't exist create it...
      if (!tabCorrespondingToTag && selectablesInputStr !== "") {
        let newTab: TabDatabase_i | SingleTabData;
        // let newTab = createFolderTab(el, 1, newTabPriority);

        newTab = userIdOrNoId
          ? createFolderTabDb(
              (globalSettings as SettingsDatabase_i).userId,
              el,
              1,
              newTabPriority
            )
          : createFolderTab(el, 1, newTabPriority);

        tagsInputArr_ToIds.push(newTab.id);

        //... and add new folder tab to the main tags list

        if (!userIdOrNoId) newBookmarksAllTagsData.push(newTab.id);

        // @ts-ignore
        newTabsToAdd.push(newTab);

        counterForIndices++;
      } else {
        // if input is not empty (if it is empty, "ALL_TAG" will be the only tag)
        if (selectablesInputStr !== "" && tabCorrespondingToTag) {
          tagsInputArr_ToIds.push(tabCorrespondingToTag.id);
        }
      }
    });

    if (newTabsToAdd.length > 0) {
      // setBookmarksAllTags([...newBookmarksAllTagsData]);
      // addTabs(newTabsToAdd);

      if (userIdOrNoId) {
        let arrOfPromises = (newTabsToAdd as TabDatabase_i[]).map((obj) =>
          addTab(obj)
        );

        let arrOfNewFolderObjs = await Promise.all(arrOfPromises);
        // let arrOfNewFolderIds = await Promise.all(arrOfPromises);

        arrOfNewFolderObjs.forEach((obj) => {
          tagsInputArr_ToIds.push(obj.data.addTab.id);
        });
      } else {
        setBookmarksAllTags([...newBookmarksAllTagsData]);
        addTabsNonAuth(newTabsToAdd);
      }
    }

    if (!userIdOrNoId) {
      addBookmarkNonAuth(
        createBookmarkNonAuth(titleInput, urlInput, tagsInputArr_ToIds)
      );
      return;
    }

    let bookmarkPromise = new Promise((resolve, reject) => {
      addBookmark(
        createBookmarkDb(
          (globalSettings as SettingsDatabase_i).userId,
          titleInput,
          urlInput,
          tagsInputArr_ToIds
        )
      ).then((result) => {
        if (result.error) {
          reject(result.error);
          return;
        }
        resolve(result.data.addBookmark);
      });
    });

    await bookmarkPromise;
    // addBookmark(createBookmark(titleInput, urlInput, tagsInputArr_ToIds));
    if (bookmarks.length === 0 && userIdOrNoId) {
      // @ts-ignore
      reexecuteBookmarks({ requestPolicy: "network-only" });
    }
  }

  function handleKeyDown(event: KeyboardEvent) {
    handleKeyDown_inner(
      event,
      event.code,
      selectablesListVis,
      setSelectablesListVis,
      setSelectablesInputStr,
      selectablesRef,
      upperUiContext,
      1
    );
  }

  function saveFunc() {
    let isThereAnError = bookmarkErrorHandling(
      titleInput,
      urlInput,
      tagsInputArr,
      selectablesInputStr,
      notesTitlesArr,
      rssTitlesArr,
      bookmarks,
      setErrors,
      setSelectablesListVis,
      "new_upperUI"
    );
    if (isThereAnError) return;

    // 1. adding bookmark  2. adding folder/s if some tags do not correspond to existing folders
    addBookmarkWrapper();
    // upperVisDispatch({ type: "NEW_BOOKMARK_TOGGLE" });
    upperUiContext.upperVisDispatch({ type: "NEW_BOOKMARK_TOGGLE" });
    upperUiContext.upperVisDispatch({
      type: "FOCUS_ON_UPPER_RIGHT_UI",
      payload: 1,
    });
  }

  return (
    <FocusLock>
      {/* 
      opacity cannot be used, because children will inherit it and the text
     won't be readable
     */}
      <div
        className="flex z-50 fixed h-full w-screen items-center justify-center"
        style={{ backgroundColor: "rgba(90, 90, 90, 0.4)" }}
        onClick={() => {
          upperUiContext.upperVisDispatch({ type: "NEW_BOOKMARK_TOGGLE" });
        }}
      >
        <div
          className={`bg-warmGray-100 pb-2 pt-3 pl-2 pr-0.5 border-2 border-${uiColor} rounded-sm md:mb-48`}
          style={{
            width: "350px",
            marginLeft: `${
              mainPaddingRight && scrollbarWidth >= 10
                ? `-${scrollbarWidth - 1}px`
                : ""
            }`,
          }}
          onClick={(e) => {
            e.stopPropagation();
            return;
          }}
        >
          <p className="text-center">New bookmark</p>
          <div className="flex justify-around mb-2 mt-3">
            <p className="flex-none" style={{ width: "60px" }}>
              Title
            </p>
            <input
              type="text"
              ref={firstFieldRef}
              className="w-full border pl-px focus-1"
              value={titleInput}
              placeholder={"new bookmark title"}
              onChange={(e) => setTitleInput(e.target.value)}
              onFocus={(e) => {
                setSelectablesListVis(false);
              }}
            />
            <div className="w-5 flex-none"></div>
          </div>
          <div className="flex justify-around mb-2">
            <p className="flex-none" style={{ width: "60px" }}>
              Link
            </p>

            <input
              type="text"
              className="w-full border pl-px focus-1"
              value={urlInput}
              placeholder={"enter proper URL address"}
              onChange={(e) => setUrlInput(e.target.value)}
              onFocus={(e) => {
                setSelectablesListVis(false);
              }}
            />
            <div className="w-5 flex-none"></div>
          </div>
          <div className="flex justify-start mb-2">
            <p className="flex-none" style={{ width: "60px" }}>
              Folders
            </p>

            <div className="relative w-full">
              <div className="relative">
                <input
                  type="text"
                  className={`w-full border pl-px ${
                    selectablesInputStr.length !== 0 ? "pr-9" : ""
                  } focus-1`}
                  ref={selectablesRef}
                  value={selectablesInputStr}
                  placeholder={"folder1, folder2..."}
                  onChange={(e) => {
                    if (!selectablesListVis) setSelectablesListVis(true);

                    let target = e.target.value;

                    setSelectablesInputStr(target);
                  }}
                  onFocus={(e) => {
                    setSelectablesListVis(true);
                  }}
                />
                {selectablesInputStr.length !== 0 && (
                  <span
                    className="flex absolute h-4 bg-white z-50"
                    style={{ top: "7px", right: "2px" }}
                  >
                    <CheckSVG
                      className="h-full text-gray-500 cursor-pointer hover:text-opacity-60"
                      onClick={() => saveFunc()}
                    />
                    <XsmallSVG
                      className="h-full text-gray-500 cursor-pointer hover:text-opacity-60"
                      onClick={() => setSelectablesInputStr("")}
                    />
                  </span>
                )}
              </div>

              {selectablesListVis && (
                <SelectableList
                  setSelectablesInputStr={setSelectablesInputStr}
                  selectablesInputStr={selectablesInputStr}
                  visibleSelectables={visibleTags}
                  initialSelectables={initialTags}
                  setSelectablesVis={setSelectablesListVis}
                  marginTop="0px"
                />
              )}
            </div>

            <div className="w-5 h-5 mt-1 flex-none">
              {selectablesListVis ? (
                <ChevronUpSVG
                  className="h-full cursor-pointer hover:text-blueGray-500"
                  onClick={() => {
                    setSelectablesListVis((b) => !b);
                  }}
                />
              ) : (
                <ChevronDownSVG
                  className="h-full cursor-pointer hover:text-blueGray-500"
                  onClick={() => {
                    setSelectablesListVis((b) => !b);
                  }}
                />
              )}
            </div>
          </div>

          <BookmarkErrors_render errors={errors} />

          <div
            className="w-full flex justify-center"
            style={{ marginTop: "26px" }}
          >
            <button
              className="h-5 w-5 mr-6 focus-2-offset-dark"
              onClick={(e) => {
                e.preventDefault();

                saveFunc();
              }}
              aria-label={"Save"}
            >
              <SaveSVG className="h-5 w-5 fill-current text-black hover:text-green-600 cursor-pointer transition-colors duration-75" />
            </button>

            <button
              className="h-5 w-5 focus-2-offset-dark"
              onClick={(e) => {
                e.preventDefault();
                upperUiContext.upperVisDispatch({
                  type: "NEW_BOOKMARK_TOGGLE",
                });
                upperUiContext.upperVisDispatch({
                  type: "FOCUS_ON_UPPER_RIGHT_UI",
                  payload: 1,
                });
              }}
              aria-label={"Close"}
            >
              <CancelSVG className="h-5 w-5 fill-current text-black hover:text-red-600 cursor-pointer transition-colors duration-75" />
            </button>
          </div>
        </div>
      </div>
    </FocusLock>
  );
}

export default NewBookmark_UpperUI;
