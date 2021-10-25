import React from "react";
import { useMutation } from "urql";

// import shallow from "zustand/shallow";

import Bookmark_newAndEdit from "../Shared/Bookmark_newAndEdit";

import { ReactComponent as PencilSmallSVG } from "../../svgs/pencilSmall.svg";
import { ReactComponent as TrashSmallSVG } from "../../svgs/trashSmall.svg";
import { ReactComponent as PhotographSVG } from "../../svgs/photograph.svg";

// import { useBookmarks } from "../../state/hooks/useBookmarks";
// import { useGlobalSettings } from "../../state/hooks/defaultSettingsHooks";
import { useTabContext } from "../../context/tabContext";
import { useTabs } from "../../state/hooks/useTabs";
import { useUpperUiContext } from "../../context/upperUiContext";

import { DeleteBookmarkMutation } from "../../graphql/graphqlMutations";

import { SingleBookmarkData, SingleTabData } from "../../utils/interfaces";
import { SettingsDatabase_i } from "../../../../schema/types/settingsType";
import { BookmarkDatabase_i } from "../../../../schema/types/bookmarkType";

interface Props {
  singleBookmarkData: SingleBookmarkData;
  bookmarkId: string;
  setBookmarkId: React.Dispatch<React.SetStateAction<string | undefined>>;
  colNumber: number;
  tabID: string;
  isTabDraggedOver: boolean;
  globalSettings: SettingsDatabase_i;
  bookmarks: SingleBookmarkData[];
  tabs: SingleTabData[];
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
  bookmarks,
  tabs,
}: Props): JSX.Element {
  // const globalSettings = useGlobalSettings((state) => state, shallow);

  const tabContext = useTabContext();

  const setFocusedTabState = useTabs((state) => state.setFocusedTabState);

  const upperUiContext = useUpperUiContext();

  const setTabDeletingPause = useTabs((store) => store.setTabDeletingPause);

  // const bookmarks = useBookmarks((state) => state.bookmarks);
  // const tabs = useTabs((state) => state.tabs);
  // const deleteBookmark = useBookmarks((state) => state.deleteBookmark);

  const [deleteBookmarkResult, deleteBookmark] = useMutation<any, BookmarkId>(
    DeleteBookmarkMutation
  );

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
            <div className="h-6 mr-px">
              <PhotographSVG className="h-full" />
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
              onClick={() => {
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

                console.log(singleBookmarkData.title);
                console.log(bookmarkId);

                deleteBookmark({ id: bookmarkId }).then((result) =>
                  console.log(result)
                );

                setTimeout(() => {
                  setTabDeletingPause(false);
                }, 500);
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
          bookmarks={bookmarks}
          tabs={tabs}
          globalSettings={globalSettings}
        />
      )}
    </div>
  );
}

export default SingleBookmark;
