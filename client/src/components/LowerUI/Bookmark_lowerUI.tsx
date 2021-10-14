import React, { useState, useRef, useEffect } from "react";
import { useMutation } from "urql";

import Bookmark_lowerUI_edit from "./Bookmark_lowerUI_edit";
import Bookmark_lowerUI_new from "./Bookmark_lowerUI_new";

import { useBookmarks } from "../../state/hooks/useBookmarks";
import { useTabs } from "../../state/hooks/useTabs";

import { useTabContext } from "../../context/tabContext";

import {
  // createBookmark,
  createBookmarkDb,
  createFolderTab,
} from "../../utils/funcs and hooks/objCreators";
import { handleKeyDown_inner } from "../../utils/funcs and hooks/handleKeyDown_bookmarksAndTabs";
import { bookmarkErrorHandling } from "../../utils/funcs and hooks/bookmarkErrorHandling";
import { AddBookmarkMutation } from "../../graphql/graphqlMutations";

import { SingleBookmarkData, SingleTabData } from "../../utils/interfaces";
import { BookmarkErrors, SetBookmarkErrors } from "../../utils/interfaces";
import { BookmarkDatabase_i } from "../../../../schema/types/bookmarkType";
import { SettingsDatabase_i } from "../../../../schema/types/settingsType";

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
  currentBookmark: SingleBookmarkData | undefined;
  colNumber: number;
  errors: BookmarkErrors;
  setErrors: SetBookmarkErrors;
  bookmarks: SingleBookmarkData[];
  tabs: SingleTabData[];
  globalSettings: SettingsDatabase_i;
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
  bookmarks,
  tabs,
  globalSettings,
}: Props): JSX.Element {
  // const addBookmark = useBookmarks((store) => store.addBookmark);
  const editBookmark = useBookmarks((store) => store.editBookmark);
  const [addBookmarkResult, addBookmark] = useMutation<any, BookmarkDatabase_i>(
    AddBookmarkMutation
  );

  // const bookmarks = useBookmarks((store) => store.bookmarks);
  // const bookmarksAllTags = useBookmarks((store) => store.bookmarksAllTags);
  const bookmarksAllTags: string[] = bookmarks.map((obj) => obj.id);
  const setBookmarksAllTags = useBookmarks(
    (store) => store.setBookmarksAllTags
  );

  const addTabs = useTabs((store) => store.addTabs);
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

  function addOrEditBookmark() {
    // creating tags for bookmark being added
    // let tagsInputArr_ToIds: string[] = ["ALL_TAGS"];
    let tagsInputArr_ToIds: string[] = [
      tabs.find((obj) => !obj.deletable)?.id as string,
    ];
    // for edit only
    let newTabId: undefined | string;
    let newTabsToAdd: SingleTabData[] = [];

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

      // if folder with title corresponding to tag doesn't exist create it...
      if (!tabForCurrentTag && selectablesInputStr !== "") {
        let newTab = createFolderTab(el, colNumber, newTabPriority);
        tagsInputArr_ToIds.push(newTab.id);
        // for edit only
        newTabId = newTab.id;

        //... and add new folder tab to the main tags list
        newBookmarksAllTagsData.push(newTab.id);
        newTabsToAdd.push(newTab);

        counterForIndices++;
      } else {
        if (selectablesInputStr !== "" && tabForCurrentTag) {
          tagsInputArr_ToIds.push(tabForCurrentTag.id);
        }
      }
    });

    if (newTabsToAdd.length > 0) {
      setBookmarksAllTags([...newBookmarksAllTagsData]);
      addTabs(newTabsToAdd);
    }

    if (bookmarkComponentType === "edit") {
      editBookmark(bookmarkId, titleInput, urlInput, tagsInputArr_ToIds);

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

      let bookmarksAllTagsData_new: string[] = [];

      if (newTabId) {
        bookmarksAllTagsData_new.push(newTabId);
      }

      bookmarksAllTags.forEach((el) => {
        if (tagsIdsToDelete.indexOf(el) === -1) {
          bookmarksAllTagsData_new.push(el);
        }
      });

      setBookmarksAllTags([...bookmarksAllTagsData_new]);
    } else {
      // addBookmark(createBookmark(titleInput, urlInput, tagsInputArr_ToIds));
      addBookmark(
        createBookmarkDb(
          globalSettings.userId,
          titleInput,
          urlInput,
          tagsInputArr_ToIds
        )
      ).then((result) => console.log(result));
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
