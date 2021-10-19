import React, { useState, useEffect, useRef } from "react";
import FocusLock from "react-focus-lock";
import { useMutation } from "urql";
// import shallow from "zustand/shallow";

import EditTab_folder from "./EditTab_folder";
import EditTab_notes from "./EditTab_notes";
import EditTab_RSS from "./EditTab_RSS";
import TabErrors from "../Shared/TabErrors_render";

import { ReactComponent as SaveSVG } from "../../svgs/save.svg";
import { ReactComponent as CancelSVG } from "../../svgs/alphabet-x.svg";
import { ReactComponent as TrashSVG } from "../../svgs/trash.svg";
import { ReactComponent as LockClosedSVG } from "../../svgs/lock-closed.svg";
import { ReactComponent as LockOpenSVG } from "../../svgs/lock-open.svg";

import { useBookmarks } from "../../state/hooks/useBookmarks";
// import { useRssSettings } from "../../state/hooks/defaultSettingsHooks";
// import { useGlobalSettings } from "../../state/hooks/defaultSettingsHooks";

import { useTabs } from "../../state/hooks/useTabs";
import { useTabContext } from "../../context/tabContext";
import { SingleBookmarkData, SingleTabData } from "../../utils/interfaces";
import { tabErrorHandling } from "../../utils/funcs and hooks/tabErrorHandling";
import { tabErrorsAllFalse as errorsAllFalse } from "../../utils/data/errors";
import {
  DeleteTabMutation,
  ChangeBookmarkMutation,
  ChangeTabMutation,
} from "../../graphql/graphqlMutations";

import { SettingsDatabase_i } from "../../../../schema/types/settingsType";
import { TabDatabase_i } from "../../../../schema/types/tabType";
import { BookmarkDatabase_i } from "../../../../schema/types/bookmarkType";
import { imageColumnColorsConcat } from "../../utils/data/colors_column";

interface TabId {
  id: string;
}

interface Props {
  tabType: "folder" | "note" | "rss";
  tabID: string;
  // currentTab: SingleTabData;
  currentTab: TabDatabase_i;
  setTabOpened_local: React.Dispatch<React.SetStateAction<boolean>>;
  globalSettings: SettingsDatabase_i;
  tabs: SingleTabData[];
  // bookmarks: SingleBookmarkData[];
  bookmarks: BookmarkDatabase_i[];
}

function EditTab({
  tabID,
  tabType,
  currentTab,
  setTabOpened_local,
  globalSettings,
  tabs,
  bookmarks,
}: Props): JSX.Element {
  // const tabs = useTabs((store) => store.tabs);
  // const editTab = useTabs((store) => store.editTab);
  const [editTabResult, editTab] = useMutation<any, TabDatabase_i>(
    ChangeTabMutation
  );

  // const deleteTab = useTabs((store) => store.deleteTab);
  const [deleteTabResult, deleteTab] = useMutation<any, TabId>(
    DeleteTabMutation
  );

  const [changeBookmarkResult, changeBookmark] = useMutation<
    any,
    BookmarkDatabase_i
  >(ChangeBookmarkMutation);
  // const rssSettingsState = useRssSettings((state) => state, shallow);
  // const globalSettings = useGlobalSettings((state) => state, shallow);
  const tabContext = useTabContext();

  let firstFieldRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (firstFieldRef.current !== null) {
      firstFieldRef.current.focus();
    }
  }, []);

  let tabTitle = currentTab.title;

  let rssLink: string | null | undefined = "no bookmark";

  if (tabType === "rss") {
    rssLink = currentTab.rssLink;
  }

  // const bookmarks = useBookmarks((state) => state.bookmarks);
  const editTag = useBookmarks((state) => state.editTag);
  const deleteTag = useBookmarks((state) => state.deleteTag);

  // for note only
  const [textAreaValue, setTextAreaValue] = useState<string | null>(
    currentTab.noteInput as string | null
  );

  const [tabTitleInput, setTabTitleInput] = useState<string>(
    tabTitle as string
  );

  const [rssLinkInput, setRssLinkInput] = useState<string>(rssLink as string);

  const [descriptionCheckbox, setDescriptionCheckbox] = useState(() => {
    if (typeof currentTab.description === "boolean") {
      return currentTab.description;
    }

    return globalSettings.description;
  });
  const [dateCheckbox, setDateCheckbox] = useState(() => {
    if (typeof currentTab.date === "boolean") {
      return currentTab.date;
    }
    return globalSettings.date;
  });

  // checkboxes won't be saved on Save if there were not manipulated
  //  (so they will still respond to changing default setting (they will have null as a property))
  const [wasCheckboxClicked, setWasCheckboxClicked] = useState(false);

  const [rssItemsPerPage, setRssItemsPerPage] = useState(() => {
    if (typeof currentTab.itemsPerPage === "number") {
      return currentTab.itemsPerPage;
    }
    return globalSettings.itemsPerPage;
  });

  // items per page won't be saved on Save if there were not manipulated
  const [wasItemsPerPageClicked, setWasItemsPerPageClicked] = useState(false);
  const [wasTabOpenClicked, setWasTabOpenClicked] = useState(false);

  // for disabling save btn
  const [wasAnythingClicked, setWasAnythingClicked] = useState(false);

  const [arrOfBookmarksNames, setArrayOfBookmarksNames] = useState<string[]>(
    () => {
      return calcArrOfBookmarksNames();
    }
  );

  function calcArrOfBookmarksNames() {
    // filtered liknks
    let filteredBookmarks = bookmarks.filter(
      (obj) => obj.tags.indexOf(currentTab.id) > -1
    );

    let arrOfBookmarksNames: string[] = [];

    filteredBookmarks.forEach((obj) => {
      arrOfBookmarksNames.push(obj.title);
    });

    return arrOfBookmarksNames;
  }

  const [selectablesInputStr, setSelectablesInputStr] = useState<string>(
    arrOfBookmarksNames.join(", ")
  );

  useEffect(() => {
    if (wasCheckboxClicked || wasTabOpenClicked || wasItemsPerPageClicked) {
      setWasAnythingClicked(true);
    }
  }, [wasCheckboxClicked, wasTabOpenClicked, wasItemsPerPageClicked]);

  const [errors, setErrors] = useState({
    ...errorsAllFalse,
  });

  const [tabOpen, setTabOpen] = useState(currentTab.openedByDefault);

  const [selectablesListVis, setSelectablesListVis] = useState<boolean>(false);

  function titleWidth() {
    // if (tabType === "note" || tabID === "ALL_TAGS") {
    if (tabType === "note" || !currentTab.deletable) {
      return "40px";
    }
    if (tabType === "rss") return "65px";
    if (tabType === "folder") return "87px";
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

  function editTabWrapper() {
    if (tabType === "folder") {
      editTab({
        ...currentTab,
        title: tabTitleInput,
        openedByDefault: tabOpen,
      });
      return;
    }

    if (tabType === "note") {
      editTab({
        ...currentTab,
        title: tabTitleInput,
        openedByDefault: tabOpen,
        noteInput: textAreaValue,
      });
    }

    if (tabType === "rss") {
      editTab({
        ...currentTab,
        title: tabTitleInput,
        openedByDefault: tabOpen,
        rssLink: rssLinkInput,
        date: dateCheckbox,
        description: descriptionCheckbox,
        itemsPerPage: rssItemsPerPage,
      });
    }

    /* if (tabType === "folder") {
      // changing a tag in bookmarks
      editTag(tabID, arrOfBookmarksNames, bookmarksInputArr);
    } */
  }

  function saveFunc() {
    if (!wasAnythingClicked) {
      return;
    }

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
      "edit",
      tabTitle
    );
    if (isThereAnError) return;

    // 1.edit tab(folder,rss or note)
    // 2. (in case of folders) delete tag from bookmark or add tag to bookmark
    editTabWrapper();

    tabContext.tabVisDispatch({ type: "EDIT_TOGGLE" });
  }

  return (
    <FocusLock>
      <div
        className={`absolute w-full z-40 bg-gray-50 pb-2 border border-blueGray-303 pl-1 pr-1 shadow-md`}
      >
        <div className="mb-3">
          <div className={`flex items-center mt-2 justify-between`}>
            <p className="flex-none" style={{ width: `${titleWidth()}` }}>
              Title
            </p>
            <input
              type="text"
              ref={firstFieldRef}
              // min-w-0 !!
              className="border w-full max-w-6xl pl-px focus-1"
              value={tabTitleInput}
              onChange={(e) => {
                setTabTitleInput(e.target.value);
                setWasAnythingClicked(true);
              }}
              onFocus={(e) => {
                setSelectablesListVis(false);
              }}
            />
            {/* {tabType === "folder" && tabID !== "ALL_TAGS" && ( */}
            {tabType === "folder" && currentTab.deletable && (
              <div
                style={{ height: "18px", width: "18px" }}
                className="flex-none -mr-1"
              ></div>
            )}
          </div>

          {/* {tabType === "folder" && tabID !== "ALL_TAGS" && ( */}
          {tabType === "folder" && currentTab.deletable && (
            <EditTab_folder
              selectablesListVis={selectablesListVis}
              setSelectablesListVis={setSelectablesListVis}
              wasAnythingClicked={wasAnythingClicked}
              setWasAnythingClicked={setWasAnythingClicked}
              selectablesInputStr={selectablesInputStr}
              setSelectablesInputStr={setSelectablesInputStr}
              saveFunc={saveFunc}
              bookmarks={bookmarks}
            />
          )}

          {tabType === "note" && (
            <EditTab_notes
              textAreaValue={textAreaValue}
              setTextAreaValue={setTextAreaValue}
              setWasAnythingClicked={setWasAnythingClicked}
            />
          )}

          {tabType === "rss" && (
            <EditTab_RSS
              dateCheckbox={dateCheckbox}
              descriptionCheckbox={descriptionCheckbox}
              rssItemsPerPage={rssItemsPerPage}
              setDateCheckbox={setDateCheckbox}
              setDescriptionCheckbox={setDescriptionCheckbox}
              setRssItemsPerPage={setRssItemsPerPage}
              setWasAnythingClicked={setWasAnythingClicked}
              setWasCheckboxClicked={setWasCheckboxClicked}
              setWasItemsPerPageClicked={setWasItemsPerPageClicked}
              tabID={tabID}
              rssLinkInput={rssLinkInput}
              setRssLinkInput={setRssLinkInput}
              globalSettings={globalSettings}
            />
          )}

          <div className={`${tabType === "rss" ? "mt-1.5" : ""}`}>
            <TabErrors
              errors={errors}
              tabType={tabType}
              componentType={"edit"}
            />
          </div>
        </div>

        <div className={`pt-2`} style={{ borderTop: "solid lightGray 1px" }}>
          <div className="flex justify-between items-center">
            <p>Lock as opened by default</p>

            {tabOpen ? (
              <button
                className="h-6 w-6 focus-2"
                onClick={() => {
                  setTabOpen((b) => !b);
                  setWasTabOpenClicked(true);
                  setSelectablesListVis(false);
                }}
                aria-label={"Disable lock as opened be default"}
              >
                <LockClosedSVG className="text-gray-700 transition-colors duration-75 hover:text-black cursor-pointer" />
              </button>
            ) : (
              <button
                className="h-6 w-6 focus-2"
                onClick={() => {
                  setTabOpen((b) => !b);
                  setWasTabOpenClicked(true);
                  setSelectablesListVis(false);
                }}
                aria-label={"Lock as opened by default"}
              >
                <LockOpenSVG className="h-6 w-6 text-gray-700 transition-colors duration-75 hover:text-black cursor-pointer" />
              </button>
            )}
          </div>

          <div className="flex justify-between items-center mt-2">
            <p>Delete</p>

            <button
              className="h-6 w-6 focus-2"
              onClick={() => {
                if (!currentTab.deletable) {
                  // setNoDeletionErrorVis(true);
                  setErrors({
                    ...errorsAllFalse,
                    noDeletionErrorVis: true,
                  });
                  return;
                }

                deleteTab({ id: tabID }).then((result) => {
                  if (tabType === "note" || tabType === "rss") {
                    return;
                  }

                  let filteredBookmarks = bookmarks.filter(
                    (obj) => obj.tags.indexOf(result.data.deleteTab.id) > -1
                  );

                  filteredBookmarks.forEach((obj) => {
                    let changedBookmark = { ...obj };
                    // console.log(JSON.stringify(changedBookmark, null, 2));
                    let indexOfDeletedTab = changedBookmark.tags.indexOf(
                      result.data.deleteTab.id
                    );
                    changedBookmark.tags.splice(indexOfDeletedTab, 1);
                    // console.log(JSON.stringify(changedBookmark, null, 2));
                    changeBookmark(changedBookmark);
                  });
                });

                tabContext.tabVisDispatch({ type: "EDIT_TOGGLE" });

                // removing deleted tab(tag) from bookmarks
                // deleteTag(tabTitle);
              }}
              aria-label={"Delete tab"}
            >
              <TrashSVG className="h-6 w-6 text-gray-500 transition-colors duration-75 hover:text-black cursor-pointer" />
            </button>
          </div>
        </div>

        <div
          className={`w-full flex justify-center ${
            tabType === "folder" ? "" : "mt-0.5"
          } `}
        >
          <button
            className="h-5 w-5 mr-6 focus-2-offset-dark"
            onClick={(e) => {
              e.preventDefault();
              saveFunc();
            }}
          >
            <SaveSVG
              className={`h-5 w-5 fill-current transition-colors duration-75 ${
                wasAnythingClicked
                  ? "text-gray-900 hover:text-green-600 cursor-pointer"
                  : "text-blueGray-400 cursor-default"
              }`}
              aria-label={"Save"}
            />
          </button>

          <button
            className="h-5 w-5 focus-2-offset-dark"
            onClick={(e) => {
              e.preventDefault();
              tabContext.tabVisDispatch({ type: "EDIT_TOGGLE" });
            }}
            aria-label={"Close"}
          >
            <CancelSVG className="h-5 w-5 fill-current text-gray-900 hover:text-red-600 cursor-pointer transition-colors duration-75" />
          </button>
        </div>
      </div>
    </FocusLock>
  );
}

export default EditTab;
