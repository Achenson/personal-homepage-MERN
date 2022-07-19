import React, { useState, useRef, useEffect } from "react";
import { useMutation } from "urql";

import Bookmark_lowerUI_edit from "./Bookmark_lowerUI_edit";
import Bookmark_lowerUI_new from "./Bookmark_lowerUI_new";

import { useBookmarks } from "../../state/hooks/useBookmarks";
import { useTabs } from "../../state/hooks/useTabs";

import { useTabContext } from "../../context/tabContext";
import { useDbContext } from "../../context/dbContext";
import { UseGlobalSettingsAll } from "../../state/hooks/defaultSettingsHooks";

import {
  createBookmarkNonAuth,
  createBookmarkDb,
  createFolderTab,
  createFolderTabDb,
} from "../../utils/funcs and hooks/objCreators";
import { handleKeyDown_inner } from "../../utils/funcs and hooks/handleKeyDown_bookmarksAndTabs";
import { bookmarkErrorHandling } from "../../utils/funcs and hooks/bookmarkErrorHandling";
import {
  AddBookmarkMutation,
  ChangeBookmarkMutation,
  AddTabMutation,
} from "../../graphql/graphqlMutations";

import { SingleBookmarkData, SingleTabData } from "../../utils/interfaces";
import { BookmarkErrors, SetBookmarkErrors } from "../../utils/interfaces";
import { BookmarkDatabase_i } from "../../../../schema/types/bookmarkType";
import { SettingsDatabase_i } from "../../../../schema/types/settingsType";
import { TabDatabase_i } from "../../../../schema/types/tabType";
import { responsePathAsArray } from "graphql";

import { DbContext_i } from "../../utils/interfaces";

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
  bookmarkId: string;
  // currentBookmark: SingleBookmarkData | undefined;
  currentBookmark: BookmarkDatabase_i | SingleBookmarkData;
  colNumber: number;
  errors: BookmarkErrors;
  setErrors: SetBookmarkErrors;
  // bookmarks: SingleBookmarkData[];
  // tabs: SingleTabData[];
  globalSettings: SettingsDatabase_i | UseGlobalSettingsAll;
  userIdOrNoId: string | null;
}

function Bookmark_lowerUI({
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
  bookmarkComponentType,
  bookmarkId,
  currentBookmark,
  colNumber,
  errors,
  setErrors,
  // bookmarks,
  // tabs,
  globalSettings,
  userIdOrNoId,
}: Props): JSX.Element {
  const addBookmarkNonAuth = useBookmarks((store) => store.addBookmark);
  const editBookmarkNonAuth = useBookmarks((store) => store.editBookmark);

  const tabsNotAuth = useTabs((state) => state.tabs);
  const bookmarksNotAuth = useBookmarks((state) => state.bookmarks);

  let bookmarks: BookmarkDatabase_i[] | SingleBookmarkData[];
  let tabs: TabDatabase_i[] | SingleTabData[];

  const bookmarksDb = useDbContext()?.bookmarks;
  // only used in authenticated version of the app
  const staleBookmarks = useDbContext()?.stale_bookmarks;
  const tabsDb = useDbContext()?.tabs;
  // const reexecuteBookmarks = useDbContext().reexecuteBookmarks;

  bookmarks = userIdOrNoId
    ? (bookmarksDb as SingleBookmarkData[])
    : bookmarksNotAuth;
  tabs = userIdOrNoId ? (tabsDb as TabDatabase_i[]) : tabsNotAuth;

  // const bookmarks = useDbContext().bookmarks;
  // const staleBookmarks = useDbContext().stale_bookmarks;
  const reexecuteBookmarks = (useDbContext() as DbContext_i)
    ?.reexecuteBookmarks;
  // const tabs = useDbContext().tabs;

  const [addBookmarkResult, addBookmark] = useMutation<any, BookmarkDatabase_i>(
    AddBookmarkMutation
  );

  const [editBookmarkResult, editBookmark] = useMutation<
    any,
    BookmarkDatabase_i
  >(ChangeBookmarkMutation);

  const [addTabResult, addTab] = useMutation<any, TabDatabase_i>(
    AddTabMutation
  );

  const setTabDeletingPause = useTabs((store) => store.setTabDeletingPause);

  // const bookmarks = useBookmarks((store) => store.bookmarks);
  const bookmarksAllTags = useBookmarks((store) => store.bookmarksAllTags);
  // DB: bookmarksAllTags in Grid only
  const setBookmarksAllTags = useBookmarks(
    (store) => store.setBookmarksAllTags
  );

  const addTabsNonAuth = useTabs((store) => store.addTabs);

  // const tabs = useTabs((store) => store.tabs);

  const tabContext = useTabContext();

  let selectablesRef = useRef<HTMLInputElement>(null);
  let firstFieldRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (firstFieldRef.current !== null) {
      firstFieldRef.current.focus();
    }
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  });

  const [initialTagsInputArr, setInitialTagsInputArr] = useState(() =>
    generateTagIds()
  );

  // for disabling save btn
  const [wasAnythingChanged, setWasAnythingChanged] = useState(false);

  function generateTagIds() {
    if (bookmarkComponentType !== "edit") {
      return [];
    }

    let arrOut: string[] = [];

    selectablesInputStr.split(", ").forEach((el) => {
      let currentTab = tabs.find((obj) => obj.title === el);
      if (currentTab) {
        arrOut.push(currentTab.id);
      }
    });

    return arrOut;
  }

  let tagsInputArr: string[] = selectablesInputStr.split(", ");

  let selectablesInputStr_noComma: string;

  if (selectablesInputStr[selectablesInputStr.length - 1] === ",") {
    selectablesInputStr_noComma = selectablesInputStr.slice(
      0,
      selectablesInputStr.length - 1
    );
    tagsInputArr = selectablesInputStr_noComma.split(", ");
  }

  async function addOrEditBookmark() {
    // creating tags for bookmark being added
    // let tagsInputArr_ToIds: string[] = ["ALL_TAGS"];
    // non deletable folder("all bookmarks") always in the arr
    let tagsInputArr_ToIds: string[] = [
      tabs.find((obj) => !obj.deletable)?.id as string,
    ];
    // for edit only
    let newTabId: undefined | string;
    // let newTabsToAdd: SingleTabData[] = [];
    let newTabsToAdd: TabDatabase_i[] = [];

    let newBookmarksAllTagsData = [...bookmarksAllTags];

    // getting higher priority for each subsequent tab that is being added at the same time
    let counterForIndices = 0;

    tagsInputArr.forEach((el, i) => {
      let tabForCurrentTag = tabs.find((obj) => obj.title === el);

      let sortedTabsInCol = tabs
        .filter((obj) => obj.column === colNumber)
        .sort((a, b) => a.priority - b.priority);

      let newTabPriority =
        sortedTabsInCol[sortedTabsInCol.length - 1].priority +
        1 +
        counterForIndices;

      // setTabDeletingPause(true);
      // if folder with title corresponding to tag doesn't exist create it...
      if (!tabForCurrentTag && selectablesInputStr !== "") {
        // let newTab = createFolderTab(el, colNumber, newTabPriority);
        let newTab = createFolderTabDb(
          (globalSettings as SettingsDatabase_i).userId,
          el,
          colNumber,
          newTabPriority
        );
        // tagsInputArr_ToIds.push(newTab.id);
        // for edit only
        // newTabId = newTab.id;

        //... and add new folder tab to the main tags list
        // newBookmarksAllTagsData.push(newTab.id);
        newTabsToAdd.push(newTab);
        console.log("newTabsToAdd");
        console.log(newTabsToAdd);

        counterForIndices++;
      } else {
        if (selectablesInputStr !== "" && tabForCurrentTag) {
          tagsInputArr_ToIds.push(tabForCurrentTag.id);
        }
      }
    });

    if (newTabsToAdd.length > 0) {
      if (userIdOrNoId) {
        let arrOfPromises = newTabsToAdd.map((obj) => addTab(obj));

        /*    let arrOfPromises: Promise<string>[] = [];
     
           newTabsToAdd.forEach((obj) => {
             let newPromise = new Promise<string>((resolve, reject) => {
               addTab(obj).then((result) => {
                 if (result.error) {
                   reject(result.error);
                   return;
                 }
                 resolve(result.data.addTab.id);
               });
             });
     
             arrOfPromises.push(newPromise);
           }); */

        let arrOfNewFolderObjs = await Promise.all(arrOfPromises);
        // let arrOfNewFolderIds = await Promise.all(arrOfPromises);

        arrOfNewFolderObjs.forEach((obj) => {
          tagsInputArr_ToIds.push(obj.data.addTab.id);
        });

        console.log(tagsInputArr_ToIds);

        /*   newTabsToAdd.forEach((obj) => {
             console.log(obj.title);
     
             addTab(obj).then((result) => {
               console.log(result);
               tagsInputArr_ToIds.push(result.data.addTab.id);
             });
           }); */
      } else {
        setBookmarksAllTags([...newBookmarksAllTagsData]);
        addTabsNonAuth(newTabsToAdd);
      }
    }

    let bookmarkPromise = new Promise((resolve, reject) => {
      if (bookmarkComponentType === "edit") {
        if (userIdOrNoId) {
          editBookmark({
            id: bookmarkId,
            userId: (globalSettings as SettingsDatabase_i).userId,
            title: titleInput,
            URL: urlInput,
            tags: tagsInputArr_ToIds,
            defaultFaviconFallback: currentBookmark.defaultFaviconFallback,
          }).then((result) => {
            if (result.error) {
              reject(result.error);
              return;
            }
            resolve(result.data.editBookmark);
          });
        } else {
          editBookmarkNonAuth(
            bookmarkId,
            titleInput,
            urlInput,
            tagsInputArr_ToIds,
            currentBookmark.defaultFaviconFallback
          );
        }

        // for deleting empty folder
        let tagsIdsToDelete: string[] = [];

        initialTagsInputArr.forEach((el) => {
          // if the tag was present in initial tags, but is not present in the end
          if (tagsInputArr_ToIds.indexOf(el) === -1) {
            // all bookmarks except for curren
            let filteredBookmarks = bookmarks.filter(
              (obj) => obj.id !== (currentBookmark as SingleBookmarkData).id
            );

            let isElPresent: boolean = false;

            filteredBookmarks.forEach((obj) => {
              if (obj.tags.indexOf(el) > -1) {
                // tag is present in some other bookmark than this
                isElPresent = true;
                return;
              }
            });

            // if (!isElPresent && el !== "ALL_TAGS") {
            if (!isElPresent && tabs.find((obj) => obj.id === el)?.deletable) {
              tagsIdsToDelete.push(el);
            }
          }
        });

        /*   let bookmarksAllTagsData_new: string[] = [];
  
        if (newTabId) {
          bookmarksAllTagsData_new.push(newTabId);
        }
   */
        /*     bookmarksAllTags.forEach((el) => {
          if (tagsIdsToDelete.indexOf(el) === -1) {
            bookmarksAllTagsData_new.push(el);
          }
        }); */

        // setBookmarksAllTags([...bookmarksAllTagsData_new]);
      } else {
        // addBookmark(createBookmark(titleInput, urlInput, tagsInputArr_ToIds));

        if (!userIdOrNoId) {
          addBookmarkNonAuth(
            createBookmarkNonAuth(titleInput, urlInput, tagsInputArr_ToIds)
          );
          return;
        }

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
      }
    });

    await bookmarkPromise;

    /* console.log("bookmarkPromise");
    console.log(bookmarkPromise); */

    if (bookmarks.length === 0 && userIdOrNoId) {
      reexecuteBookmarks({ requestPolicy: "network-only" });
    }

    // setTimeout(() => setTabDeletingPause(false), 500);
    if (bookmarkComponentType === "edit") {
      setTabDeletingPause(false);
    }
  }

  function handleKeyDown(event: KeyboardEvent) {
    handleKeyDown_inner(
      event,
      event.code,
      selectablesListVis,
      setSelectablesListVis,
      setSelectablesInputStr,
      selectablesRef
    );
  }

  function saveFunc() {
    if (bookmarkComponentType === "edit" && !wasAnythingChanged) {
      return;
    }

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
      bookmarkComponentType,
      bookmarkComponentType === "edit" ? currentBookmark : undefined
    );
    if (isThereAnError) return;

    // 1. adding or editing bookmark
    // 2. adding folder/s (also to the main state with array of tags) if some tags do not correspond to existing folders
    // 3. (if editing bookmark) for deleting empty folder -> setting bookmarksAllTagsState
    addOrEditBookmark();

    if (bookmarkComponentType === "edit") {
      tabContext.tabVisDispatch({ type: "EDIT_BOOKMARK_CLOSE" });
    }

    if (bookmarkComponentType === "new_lowerUI") {
      tabContext.tabVisDispatch({ type: "NEW_BOOKMARK_TOOGLE" });
    }
  }

  const editAndNewProps = {
    bookmarkComponentType,
    errors,
    firstFieldRef,
    selectablesRef,
    initialTags,
    saveFunc,
    selectablesInputStr,
    setSelectablesInputStr,
    selectablesListVis,
    setSelectablesListVis,
    titleInput,
    setTitleInput,
    urlInput,
    setUrlInput,
    visibleTags,
  };

  return bookmarkComponentType === "edit" ? (
    <Bookmark_lowerUI_edit
      {...editAndNewProps}
      wasAnythingChanged={wasAnythingChanged}
      setWasAnythingChanged={setWasAnythingChanged}
    />
  ) : (
    <Bookmark_lowerUI_new {...editAndNewProps} />
  );
}

export default Bookmark_lowerUI;
