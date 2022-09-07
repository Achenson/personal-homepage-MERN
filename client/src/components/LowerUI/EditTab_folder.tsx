import React, { useState, useEffect, useRef } from "react";

import SelectableList from "../Shared/SelectableList";

import { ReactComponent as ChevronDownSVG } from "../../svgs/chevron-down.svg";
import { ReactComponent as ChevronUpSVG } from "../../svgs/chevron-up.svg";
import { ReactComponent as CheckSVG } from "../../svgs/check-small.svg";
import { ReactComponent as XsmallSVG } from "../../svgs/x-small.svg";

import { useBookmarks } from "../../state/hooks/useBookmarks";
// import { useTabs } from "../../state/hooks/useTabs";
import { useBookmarksDb } from "../../state/hooks/useBookmarksDb";

import { handleKeyDown_inner } from "../../utils/funcs and hooks/handleKeyDown_bookmarksAndTabs";
import { SingleBookmarkData, SingleTabData } from "../../utils/interfaces";
// import { useDbContext } from "../../context/dbContext";

import { BookmarkDatabase_i } from "../../../../schema/types/bookmarkType";
// import { TabDatabase_i } from "../../../../schema/types/tabType";

interface Props {
  selectablesListVis: boolean;
  setSelectablesListVis: React.Dispatch<React.SetStateAction<boolean>>;
  wasAnythingClicked: boolean;
  setWasAnythingClicked: React.Dispatch<React.SetStateAction<boolean>>;
  selectablesInputStr: string;
  setSelectablesInputStr: React.Dispatch<React.SetStateAction<string>>;
  saveFunc: () => void;
  // bookmarks: SingleBookmarkData[];
  userIdOrNoId: string | null;
}

function EditTab_folder({
  selectablesListVis,
  setSelectablesListVis,
  wasAnythingClicked,
  setWasAnythingClicked,
  selectablesInputStr,
  setSelectablesInputStr,
  saveFunc,
  userIdOrNoId,
}: // bookmarks
Props): JSX.Element {
  // const tabsNotAuth = useTabs((state) => state.tabs);
  const bookmarksNotAuth = useBookmarks((store) => store.bookmarks);

  const bookmarksDb = useBookmarksDb((store) => store.bookmarksDb);

  // const bookmarksDb = useDbContext()?.bookmarks;
  // const tabsDb = useDbContext()?.tabs;
  // const reexecuteBookmarks = useDbContext().reexecuteBookmarks;

  let bookmarks: BookmarkDatabase_i[] | SingleBookmarkData[];
  // let tabs: TabDatabase_i[] | SingleTabData[];

  bookmarks = userIdOrNoId
    ? (bookmarksDb as SingleBookmarkData[])
    : bookmarksNotAuth;
  // tabs = userIdOrNoId ? (tabsDb as TabDatabase_i[]) : tabsNotAuth;

  // const bookmarks = useBookmarks((state) => state.bookmarks);
  // const bookmarks = useDbContext().bookmarks;

  let selectablesRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  });

  const [initialBookmarks, setInitialBookmarks] = useState(() =>
    makeInitialBookmarks()
  );

  const [visibleBookmarks, setVisibleBookmarks] = useState<string[]>(() =>
    makeInitialBookmarks()
  );

  useEffect(() => {
    let newVisibleBookmarks: string[] = [];

    let selectablesInputArr = selectablesInputStr.split(", ");

    let lastSelectablesArrEl =
      selectablesInputArr[selectablesInputArr.length - 1];

    function letterToLetterMatch(lastInput: string, el: string) {
      for (let i = 0; i < lastInput.length; i++) {
        if (
          lastInput[i] !== el[i] &&
          // returns true if lastInput is present in initial bookmarks
          initialBookmarks.indexOf(lastInput) === -1 &&
          // returns true is last char is a comma
          selectablesInputStr[selectablesInputStr.length - 1] !== ","
        ) {
          return false;
        }
      }
      return true;
    }

    initialBookmarks.forEach((el) => {
      // in new RegExp the \ needs to be escaped!
      // \b -> word boundary
      let tagRegex = new RegExp(`\\b${el}\\b`);

      let tagRegex_2 = new RegExp(`(^|\\s+|,+|(\\s+,+)*|(,+\\s+)*)${el}(\\s+|,+|(\\s+,+)*|(,+\\s+)*|$)`)

      // let tagRegex = new RegExp(`${el}`);
      // a selectable is visible only if the input does not contain it
      if (
        !tagRegex_2.test(selectablesInputStr) &&
        // !tagRegex.test(selectablesInputStr) &&
        (letterToLetterMatch(lastSelectablesArrEl, el) ||
          selectablesInputStr.length === 0)
      ) {
        newVisibleBookmarks.push(el);
      }
    });

    setVisibleBookmarks([...newVisibleBookmarks]);

    if (newVisibleBookmarks.length === 0) {
      setSelectablesListVis(false);
    }
  }, [
    selectablesInputStr,
    initialBookmarks,
    setVisibleBookmarks,
    setSelectablesListVis,
  ]);

  function makeInitialBookmarks(): string[] {
    let bookmarksInitial: string[] = [];

    bookmarks.forEach((obj) => {
      bookmarksInitial.push(obj.title);
    });

    return bookmarksInitial;
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

  return (
    /* bookmarks not visible for tab with ALL Bookmarks */
    <div className="flex items-center mt-2 justify-between">
      <p className={`flex-none`} style={{ width: "87px" }}>
        Bookmarks
      </p>
      <div className="relative w-full">
        <div className={`relative`}>
          <input
            type="text"
            // min-w-0 !! ??
            className={`border pl-px w-full ${
              selectablesInputStr.length !== 0 ? "pr-9" : ""
            } focus-1 ${
              selectablesInputStr.length === 0 ? "text-sm" : "text-base"
            }`}
            style={{ height: "26px" }}
            ref={selectablesRef}
            value={selectablesInputStr}
            onChange={(e) => {
              setWasAnythingClicked(true);
              if (!selectablesListVis) setSelectablesListVis(true);

              let target = e.target.value;

              setSelectablesInputStr(target);
            }}
            onFocus={(e) => {
              setSelectablesListVis(true);
            }}
            placeholder={"Choose at least one"}
          />
          {selectablesInputStr.length !== 0 && (
            <span
              className="flex absolute h-4 bg-white z-50"
              style={{ top: "7px", right: "2px" }}
            >
              <CheckSVG
                className={`h-full  ${
                  wasAnythingClicked
                    ? "text-gray-500 cursor-pointer hover:text-opacity-60"
                    : "text-gray-300 cursor-default"
                }`}
                onClick={() => {
                  if (wasAnythingClicked) {
                    saveFunc();
                  }
                }}
              />
              <XsmallSVG
                className="h-full text-gray-500 cursor-pointer hover:text-opacity-60"
                onClick={() => {
                  setSelectablesInputStr("");
                  setWasAnythingClicked(true);
                }}
              />
            </span>
          )}
        </div>

        {selectablesListVis && (
          <SelectableList
            setSelectablesInputStr={setSelectablesInputStr}
            selectablesInputStr={selectablesInputStr}
            visibleSelectables={visibleBookmarks}
            setSelectablesVis={setSelectablesListVis}
            initialSelectables={initialBookmarks}
            marginTop="0px"
            setWasAnythingClicked={setWasAnythingClicked}
          />
        )}
      </div>

      <div
        style={{ height: "18px", width: "18px" }}
        className=" mt-0.5 flex-none -mr-1"
      >
        {selectablesListVis ? (
          <ChevronUpSVG
            className="h-full cursor-pointer hover:text-blueGray-500 transition-colors duration-75"
            onClick={() => {
              setSelectablesListVis((b) => !b);
            }}
          />
        ) : (
          <ChevronDownSVG
            className="h-full cursor-pointer hover:text-blueGray-500 transition-colors duration-75"
            onClick={() => {
              setSelectablesListVis((b) => !b);
            }}
          />
        )}
      </div>
    </div>
  );
}

export default EditTab_folder;
