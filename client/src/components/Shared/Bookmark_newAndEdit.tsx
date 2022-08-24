import React, { useState, useEffect } from "react";

import NewBookmark_UpperUI from "../UpperUI/NewBookmark_UpperUI";
import Bookmark_lowerUI from "../LowerUI/Bookmark_lowerUI";

import { useBookmarks } from "../../state/hooks/useBookmarks";
import { useTabs } from "../../state/hooks/useTabs";
import { useDbContext } from "../../context/dbContext";

import { GlobalSettingsState, SingleBookmarkData, SingleTabData } from "../../utils/interfaces";
import { BookmarkDatabase_i } from "../../../../schema/types/bookmarkType";
import { UseGlobalSettingsAll } from "../../state/hooks/defaultSettingsHooks";
import { TabDatabase_i } from "../../../../schema/types/tabType";

interface Props {
  bookmarkComponentType: "new_upperUI" | "new_lowerUI" | "edit";
  colNumber?: number;
  // for "edit" type only
  bookmarkId?: string | undefined;
  // for lowerUI newBookmark only
  tabTitle?: string;
  // for upperUI newBookmark only
  mainPaddingRight?: boolean;
  scrollbarWidth?: number;
  // bookmarks: SingleBookmarkData[];
  // tabs: SingleTabData[];
  // bookmarks: SingleBookmarkData[];
  globalSettings: GlobalSettingsState;
  userIdOrNoId: string | null;
}

const errorsAllFalse = {
  tagErrorVis: false,
  tagRepeatErrorVis: false,
  titleFormatErrorVis: false,
  titleUniquenessErrorVis: false,
  noteErrorVis: false,
  rssErrorVis: false,
  invalidLinkVis: false,
};

function Bookmark_newAndEdit({
  bookmarkComponentType,
  bookmarkId,
  tabTitle,
  colNumber,
  mainPaddingRight,
  scrollbarWidth,
  // bookmarks,
  // tabs,
  globalSettings,
  userIdOrNoId
}: Props): JSX.Element {
  // const bookmarks = useBookmarks((state) => state.bookmarks);
  // const tabs = useTabs((state) => state.tabs);

  // const bookmarks = useDbContext().bookmarks;
  // const tabs = useDbContext().tabs;

  const tabsNotAuth = useTabs((store) => store.tabs);
  const bookmarksNotAuth = useBookmarks((store) => store.bookmarks);

  let bookmarks: BookmarkDatabase_i[] | SingleBookmarkData[];
  let tabs: TabDatabase_i[] | SingleTabData[];

  const bookmarksDb = useDbContext()?.bookmarks;
  const tabsDb = useDbContext()?.tabs;
  // const reexecuteBookmarks = useDbContext().reexecuteBookmarks;

  bookmarks = userIdOrNoId
    ? (bookmarksDb as SingleBookmarkData[])
    : bookmarksNotAuth;
  tabs = userIdOrNoId ? (tabsDb as TabDatabase_i[]) : tabsNotAuth;

  let currentBookmark: SingleBookmarkData | undefined;

  if (bookmarkComponentType === "edit") {
    currentBookmark = bookmarks.filter((obj) => obj.id === bookmarkId)[0];
  }

  let foldersTab = tabs.filter((obj) => obj.type === "folder");

  const [titleInput, setTitleInput] = useState<string>(
    bookmarkComponentType === "edit"
      ? (currentBookmark as SingleBookmarkData).title
      : ""
  );

  //  !!! diff in editLink
  const [urlInput, setUrlInput] = useState<string>(
    bookmarkComponentType === "edit"
      ? (currentBookmark as SingleBookmarkData).URL
      : ""
  );

  //  !!! diff in editLink
  const [selectablesInputStr, setSelectablesInputStr] = useState<string>(() =>
    generateTagNames()
  );

  function generateTagNames() {
    if (bookmarkComponentType === "new_upperUI") {
      return "";
    }

    if (bookmarkComponentType === "new_lowerUI") {
      // if (tabTitle !== tabs.find((obj) => obj.id === "ALL_TAGS")?.title) {
      if (tabTitle !== tabs.find((obj) => !obj.deletable)?.title) {
        return tabTitle as string;
      } else return "";
    }

    let arrOut: string[] = [];

    tabs.forEach((obj) => {
      if (
        (currentBookmark as SingleBookmarkData).tags.indexOf(obj.id) > -1 &&
        // obj.id !== "ALL_TAGS"
        obj.deletable
      ) {
        arrOut.push(obj.title);
      }
    });

    return arrOut.join(", ");
  }

  const [selectablesListVis, setSelectablesListVis] = useState<boolean>(false);

  const [visibleTags, setVisibleTags] = useState<string[]>(() =>
    makeInitialTags()
  );

  const [initialTags, setInitialTags] = useState(() => makeInitialTags());

  const [errors, setErrors] = useState({
    ...errorsAllFalse,
  });

  let notesTitlesArr: string[] = [];
  let rssTitlesArr: string[] = [];

  tabs.forEach((obj) => {
    if (obj.type === "note") {
      notesTitlesArr.push(obj.title);
    }

    if (obj.type === "rss") {
      rssTitlesArr.push(obj.title);
    }
  });

  useEffect(() => {
    let newVisibleTags: string[] = [];

    let selectablesInputArr = selectablesInputStr.split(", ");

    let lastSelectablesArrEl =
      selectablesInputArr[selectablesInputArr.length - 1];

    function letterToLetterMatch(lastInput: string, el: string) {
      for (let i = 0; i < lastInput.length; i++) {
        if (
          lastInput[i] !== el[i] &&
          // returns true if lastInput is present in initial bookmarks
          initialTags.indexOf(lastInput) === -1 &&
          // returns true is last char is a comma
          selectablesInputStr[selectablesInputStr.length - 1] !== ","
        ) {
          return false;
        }
      }
      return true;
    }

    initialTags.forEach((el) => {
      // in new RegExp the \ needs to be escaped!
      // \b -> word boundary
      let tagRegex = new RegExp(`\\b${el}\\b`);

      // a selectable is visible only if the input does not contain it
      if (
        !tagRegex.test(selectablesInputStr) &&
        (letterToLetterMatch(lastSelectablesArrEl, el) ||
          selectablesInputStr.length === 0)
      ) {
        newVisibleTags.push(el);
      }
    });

    setVisibleTags([...newVisibleTags]);

    if (newVisibleTags.length === 0) {
      setSelectablesListVis(false);
    }
  }, [selectablesInputStr, initialTags, setVisibleTags, setSelectablesListVis]);

  function makeInitialTags(): string[] {
    let tags: string[] = [];

    foldersTab.forEach((obj) => {
      // if (obj.id !== "ALL_TAGS") {
      if (obj.deletable) {
        tags.push(obj.title);
      }
    });

    return tags;
  }

  const bookmark_props = {
    titleInput,
    setTitleInput,
    urlInput,
    setUrlInput,
    selectablesInputStr,
    setSelectablesInputStr,
    visibleTags,
    setVisibleTags,
    initialTags,
    selectablesListVis,
    setSelectablesListVis,
    notesTitlesArr,
    rssTitlesArr,
    bookmarkComponentType,
    errors,
    setErrors,
  };

  return (
    <>
      {bookmarkComponentType === "new_upperUI" ? (
        <NewBookmark_UpperUI
          {...bookmark_props}
          mainPaddingRight={mainPaddingRight as boolean}
          scrollbarWidth={scrollbarWidth as number}
          // bookmarks={bookmarks}
          // tabs={tabs}
          globalSettings={globalSettings}
          userIdOrNoId={userIdOrNoId}
        />
      ) : (
        <Bookmark_lowerUI
          {...bookmark_props}
          currentBookmark={currentBookmark as BookmarkDatabase_i}
          bookmarkId={bookmarkId as string}
          colNumber={colNumber as number}
          // bookmarks={bookmarks}
          // tabs={tabs}
          globalSettings={globalSettings}
          userIdOrNoId={userIdOrNoId}
        />
      )}
    </>
  );
}

export default Bookmark_newAndEdit;
