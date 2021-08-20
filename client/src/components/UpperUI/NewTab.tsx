import React, { useState, useEffect, useRef } from "react";

import FocusLock from "react-focus-lock";

import SelectableList from "../Shared/SelectableList";
import TabErrors from "../Shared/TabErrors_render";

import { ReactComponent as SaveSVG } from "../../svgs/save.svg";
import { ReactComponent as CancelSVG } from "../../svgs/alphabet-x.svg";
import { ReactComponent as CheckSVG } from "../../svgs/check-small.svg";
import { ReactComponent as XsmallSVG } from "../../svgs/x-small.svg";
import { ReactComponent as ChevronDownSVG } from "../../svgs/chevron-down.svg";
import { ReactComponent as ChevronUpSVG } from "../../svgs/chevron-up.svg";

import { useDefaultColors } from "../../state/hooks/colorHooks";
import { useBookmarks } from "../../state/hooks/useBookmarks";
import { useTabs } from "../../state/hooks/useTabs";

import {
  createFolderTab,
  createNote,
  createRSS,
} from "../../utils/funcs and hooks/objCreators";

import { tabErrorHandling } from "../../utils/funcs and hooks/tabErrorHandling";
import { tabErrorsAllFalse as errorsAllFalse } from "../../utils/data/errors";
import { handleKeyDown_inner } from "../../utils/funcs and hooks/handleKeyDown_bookmarksAndTabs";
import { useUpperUiContext } from "../../context/upperUiContext";

interface Props {
  tabType: "folder" | "note" | "rss";
  mainPaddingRight: boolean;
}

function NewTab({ tabType, mainPaddingRight }: Props): JSX.Element {
  const tabs = useTabs((state) => state.tabs);
  const addTabs = useTabs((state) => state.addTabs);
  const bookmarks = useBookmarks((state) => state.bookmarks);
  const addTag = useBookmarks((state) => state.addTag);
  const bookmarksAllTags = useBookmarks((store) => store.bookmarksAllTags);
  const setBookmarksAllTags = useBookmarks(
    (store) => store.setBookmarksAllTags
  );
  const uiColor = useDefaultColors((state) => state.uiColor);

  const upperUiContext = useUpperUiContext();

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  });

  let selectablesRef = useRef<HTMLInputElement>(null);
  let firstFieldRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (firstFieldRef.current !== null) {
      firstFieldRef.current.focus();
    }
  }, []);

  const [tabTitleInput, setTabTitleInput] = useState<string>("");
  const [rssLinkInput, setRssLinkInput] = useState<string>("");
  const [tabColumnInput, setTabColumnInput] = useState<number>(1);

  const [errors, setErrors] = useState({
    ...errorsAllFalse,
  });

  const [selectablesListVis, setSelectablesListVis] = useState<boolean>(false);
  const [visibleBookmarks, setVisibleBookmarks] = useState<string[]>(() =>
    makeInitialBookmarks()
  );

  const [selectablesInputStr, setSelectablesInputStr] = useState<string>("");
  const [textAreaValue, setTextAreaValue] = useState<string | null>("");

  const [initialBookmarks, setInitialBookmarks] = useState(() =>
    makeInitialBookmarks()
  );

  // XX tags won't be visible on first render even though visibleTags length won't be 0 (see useEffect)
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

      // a selectable is visible only if the input does not contain it
      if (
        !tagRegex.test(selectablesInputStr) &&
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

  function renderColsNumberControls() {
    const arrOfColsNumbers: (1 | 2 | 3 | 4)[] = [1, 2, 3, 4];

    let colsNumbering = {
      1: "I",
      2: "II",
      3: "III",
      4: "IV",
    };

    let colsNumberingForAria = {
      1: "First",
      2: "Second",
      3: "Third",
      4: "Fourth",
    };

    return arrOfColsNumbers.map((el, i) => {
      return (
        <div className="flex items-center ml-2 justify-end w-full" key={i}>
          <p className="mr-px">{colsNumbering[el]}</p>
          <button
            className="ml-0.5 mt-px focus-1-offset-dark"
            onClick={() => {
              setTabColumnInput(el);
              setSelectablesListVis(false);
            }}
            aria-label={`${colsNumberingForAria[el]} column`}
          >
            <div
              className={`h-4 w-4  cursor-pointer transition duration-75 border-2 border-${uiColor} ${
                tabColumnInput === el
                  ? `bg-${uiColor} hover:bg-opacity-50`
                  : `hover:bg-${uiColor} hover:bg-opacity-50`
              } `}
            ></div>
          </button>
        </div>
      );
    });
  }

  let bookmarksInputArr: string[] = selectablesInputStr.split(", ");

  let selectablesInputStr_noComma: string;

  if (selectablesInputStr[selectablesInputStr.length - 1] === ",") {
    selectablesInputStr_noComma = selectablesInputStr.slice(
      0,
      selectablesInputStr.length - 1
    );
    bookmarksInputArr = selectablesInputStr_noComma.split(", ");
  }

  function addTabWrapper() {
    let sortedTabsInCol = tabs
      .filter((obj) => obj.column === tabColumnInput)
      .sort((a, b) => a.priority - b.priority);

    let newTabPriority: number = 0;

    if (sortedTabsInCol.length > 0) {
      newTabPriority = sortedTabsInCol[sortedTabsInCol.length - 1].priority + 1;
    }

    if (tabType === "note") {
      addTabs([
        {
          ...createNote(
            tabTitleInput,
            tabColumnInput,
            newTabPriority,
            textAreaValue
          ),
        },
      ]);
    }

    if (tabType === "folder") {
      let newFolderTab = createFolderTab(
        tabTitleInput,
        tabColumnInput,
        newTabPriority
      );

      let newBookmarksAllTagsData = [...bookmarksAllTags];
      newBookmarksAllTagsData.push(newFolderTab.id);
      setBookmarksAllTags([...newBookmarksAllTagsData]);

      addTabs([newFolderTab]);
      // updating links data (tags array)
      addTag(newFolderTab.id, bookmarksInputArr);
    }

    if (tabType === "rss") {
      addTabs([
        {
          ...createRSS(
            tabTitleInput,
            tabColumnInput,
            newTabPriority,
            rssLinkInput
          ),
        },
      ]);
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
      tabType === "folder" ? 2 : tabType === "note" ? 3 : 4
    );
  }

  function saveFunc() {
    let isThereAnError = tabErrorHandling(
      bookmarks,
      tabTitleInput,
      setErrors,
      setSelectablesListVis,
      tabType,
      bookmarksInputArr,
      rssLinkInput,
      tabs,
      textAreaValue,
      "new"
    );
    if (isThereAnError) return;

    // 1. adding Tab(Folder/RSS?Notes) 2.updating Bookmarks with tags (same as new folder title)
    addTabWrapper();
    upperUiContext.upperVisDispatch({ type: "NEW_TAB_TOGGLE" });
    upperUiContext.upperVisDispatch({
      type: "FOCUS_ON_UPPER_RIGHT_UI",
      payload: calcFocusPayload(),
    });
  }

  function calcFocusPayload() {
    switch (tabType) {
      case "folder":
        return 2;
      case "note":
        return 3;
      case "rss":
        return 4;
    }
  }

  return (
    <FocusLock>
      <div
        className="flex z-50 fixed h-full w-screen items-center justify-center"
        style={{ backgroundColor: "rgba(90, 90, 90, 0.4)" }}
        onClick={() => {
          upperUiContext.upperVisDispatch({ type: "NEW_TAB_TOGGLE" });
        }}
      >
        <div
          className={`bg-warmGray-100 pb-2 pt-3 pl-2 pr-0.5 border-2 border-${uiColor} rounded-sm md:mb-48 ${
            mainPaddingRight ? "-ml-4" : ""
          }`}
          style={{ width: "350px" }}
          onClick={(e) => {
            e.stopPropagation();
            return;
          }}
        >
          <p className="text-center">
            New{" "}
            {tabType === "folder"
              ? "folder"
              : tabType === "note"
              ? "note"
              : "RSS channel"}
          </p>
          <div className="flex justify-around mb-2 mt-3">
            <p
              className="flex-none"
              style={{ width: `${tabType === "folder" ? "87px" : "66px"}` }}
            >
              Title
            </p>
            <input
              ref={firstFieldRef}
              type="text"
              className="w-full border pl-px focus-1"
              value={tabTitleInput}
              placeholder={
                tabType === "folder"
                  ? "new folder title"
                  : tabType === "note"
                  ? "new note title"
                  : "new RSS title"
              }
              onChange={(e) => {
                setTabTitleInput(e.target.value);
              }}
              onFocus={(e) => {
                setSelectablesListVis(false);
              }}
            />

            <div className="w-5 flex-none"></div>
          </div>

          {tabType === "folder" && (
            <div className="flex justify-around mb-2 mt-2">
              <p className="flex-none" style={{ width: "87px" }}>
                Bookmarks
              </p>
              <div className="relative w-full">
                <div className="relative">
                  <input
                    type="text"
                    className={`w-full border pl-px focus-1 ${
                      selectablesInputStr.length !== 0 ? "pr-9" : ""
                    }`}
                    value={selectablesInputStr}
                    ref={selectablesRef}
                    onChange={(e) => {
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
                    visibleSelectables={visibleBookmarks}
                    initialSelectables={initialBookmarks}
                    setSelectablesVis={setSelectablesListVis}
                    marginTop="0px"
                  />
                )}
              </div>

              <div className="flex-none w-5 h-5 mt-1">
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
          )}

          {tabType === "rss" && (
            <div className="flex justify-around mb-2 mt-2">
              <p className="flex-none" style={{ width: "66px" }}>
                RSS link
              </p>
              <div className="w-full">
                <input
                  type="text"
                  className="w-full border pl-px focus-1"
                  value={rssLinkInput}
                  placeholder="enter RSS link"
                  onChange={(e) => setRssLinkInput(e.target.value)}
                />
              </div>
              <div className="w-5 flex-none"></div>
            </div>
          )}

          <div className="flex justify-between mb-2 mt-2">
            <p className="w-32">Column</p>
            <div className="flex">
              {renderColsNumberControls()}
              <div className="w-5 flex-none"></div>
            </div>
          </div>

          {tabType === "note" && (
            <div>
              <textarea
                value={textAreaValue as string}
                className="h-full w-full overflow-visible pl-1 pr-1 border font-mono focus-1"
                rows={10}
                onChange={(e) => {
                  setTextAreaValue(e.target.value);
                }}
              ></textarea>
            </div>
          )}

          <TabErrors errors={errors} tabType={tabType} componentType={"new"} />

          <div className="w-full flex justify-center"
          style={{marginTop: "18px"}}
          >
            <button
              className="h-5 w-5 mr-6 focus-2-offset-dark"
              onClick={(e) => {
                e.preventDefault();

                saveFunc();
              }}
              aria-label={"Save"}
            >
              <SaveSVG className="h-5 w-5 fill-current text-black mr-6 hover:text-green-600 cursor-pointer transition-colors duration-75" />
            </button>

            <button
              className="h-5 w-5 focus-2-offset-dark"
              onClick={(e) => {
                e.preventDefault();
                upperUiContext.upperVisDispatch({ type: "NEW_TAB_TOGGLE" });
                upperUiContext.upperVisDispatch({
                  type: "FOCUS_ON_UPPER_RIGHT_UI",
                  payload: calcFocusPayload(),
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

export default NewTab;
