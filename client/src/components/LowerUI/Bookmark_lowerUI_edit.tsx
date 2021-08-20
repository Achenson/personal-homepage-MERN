import React from "react";

import FocusLock from "react-focus-lock";

import SelectableList from "../Shared/SelectableList";
import BookmarkErrors_render from "../Shared/BookmarkErrors_render";

import { ReactComponent as SaveSVG } from "../../svgs/save.svg";
import { ReactComponent as CancelSVG } from "../../svgs/alphabet-x.svg";
import { ReactComponent as CheckSVG } from "../../svgs/check-small.svg";
import { ReactComponent as XsmallSVG } from "../../svgs/x-small.svg";
import { ReactComponent as ChevronDownSVG } from "../../svgs/chevron-down.svg";
import { ReactComponent as ChevronUpSVG } from "../../svgs/chevron-up.svg";

import { useTabContext } from "../../context/tabContext";
import { BookmarkErrors } from "../../utils/interfaces";

interface Props {
  firstFieldRef: React.RefObject<HTMLInputElement>;
  titleInput: string;
  setTitleInput: React.Dispatch<React.SetStateAction<string>>;
  wasAnythingChanged: boolean;
  setWasAnythingChanged: React.Dispatch<React.SetStateAction<boolean>>;
  selectablesListVis: boolean;
  setSelectablesListVis: React.Dispatch<React.SetStateAction<boolean>>;
  urlInput: string;
  setUrlInput: React.Dispatch<React.SetStateAction<string>>;
  selectablesRef: React.RefObject<HTMLInputElement>;
  selectablesInputStr: string;
  setSelectablesInputStr: React.Dispatch<React.SetStateAction<string>>;
  visibleTags: string[];
  initialTags: string[];
  errors: BookmarkErrors;
  bookmarkComponentType: "new_upperUI" | "new_lowerUI" | "edit";
  saveFunc: () => void;
}

function Bookmark_lowerUI_edit({
  firstFieldRef,
  titleInput,
  setTitleInput,
  setWasAnythingChanged,
  selectablesListVis,
  setSelectablesListVis,
  urlInput,
  setUrlInput,
  selectablesRef,
  selectablesInputStr,
  setSelectablesInputStr,
  visibleTags,
  initialTags,
  errors,
  bookmarkComponentType,
  wasAnythingChanged,
  saveFunc,
}: Props): JSX.Element {
  const tabContext = useTabContext();

  return (
    <FocusLock>
      <div
        className=" bg-gray-100 pb-2 pl-1"
        style={{
          boxShadow:
            "inset 11px 11px 4px -10px rgba(0, 0, 0, 0.8), inset -11px -11px 4px -10px rgba(0, 0, 0, 0.05)",
        }}
      >
        <div className="pt-2">
          <div className="flex justify-around mb-2 mt-2">
            <p className="w-10 flex-none">Title</p>

            <input
              type="text"
              ref={firstFieldRef}
              className="w-full border pl-px focus-1"
              value={titleInput}
              placeholder={"new bookmark title"}
              onChange={(e) => {
                setTitleInput(e.target.value);
                setWasAnythingChanged(true);
              }}
              onFocus={(e) => {
                setSelectablesListVis(false);
              }}
            />

            <div className="invisible flex-none" style={{ width: "18px" }} />
          </div>
          <div className="flex justify-around mb-2">
            <p className="w-10 flex-none">Link</p>

            <input
              type="text"
              className="w-full border pl-px focus-1"
              value={urlInput}
              placeholder={"enter proper URL address"}
              onChange={(e) => {
                setUrlInput(e.target.value);
                setWasAnythingChanged(true);
              }}
              onFocus={(e) => {
                setSelectablesListVis(false);
              }}
            />
            <div className="invisible flex-none" style={{ width: "18px" }} />
          </div>
          <div className="flex justify-start mb-2">
            <p className="w-10 flex-none">Tags</p>

            <div className="relative w-full">
              <div className="relative">
                <input
                  type="text"
                  className={`w-full border pl-px ${
                    selectablesInputStr.length !== 0 ? "pr-9" : ""
                  } focus-1`}
                  ref={selectablesRef}
                  value={selectablesInputStr}
                  placeholder={"tag1, tag2..."}
                  onChange={(e) => {
                    setWasAnythingChanged(true);
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
                    className="flex absolute h-4"
                    style={{ top: "7px", right: "2px" }}
                  >
                    <CheckSVG
                      className={`h-full  ${
                        wasAnythingChanged
                          ? "text-gray-500 cursor-pointer hover:text-opacity-60"
                          : "text-gray-300 cursor-default"
                      }`}
                      onClick={() => {
                        if (wasAnythingChanged) {
                          saveFunc();
                        }
                      }}
                    />
                    <XsmallSVG
                      className="h-full text-gray-500 cursor-pointer hover:text-opacity-60"
                      onClick={() => {
                        setSelectablesInputStr("");
                        if ((bookmarkComponentType = "edit")) {
                          setWasAnythingChanged(true);
                        }
                      }}
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
                  setWasAnythingClicked={setWasAnythingChanged}
                />
              )}
            </div>

            <div
              style={{ height: "18px", width: "18px", marginTop: "5px" }}
              className=" flex-none"
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

          <BookmarkErrors_render errors={errors} />

          {/* SaveSVG is cut without the <p> - bug? */}
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
              <SaveSVG
                className={`h-5 w-5 fill-current text-black transition-colors duration-75 ${
                  wasAnythingChanged
                    ? "text-gray-900 hover:text-green-600 cursor-pointer"
                    : "text-blueGray-400 cursor-default"
                }`}
              />
            </button>

            <button
              className="h-5 w-5 focus-2-offset-dark"
              onClick={(e) => {
                e.preventDefault();
                if (bookmarkComponentType === "edit") {
                  tabContext.tabVisDispatch({ type: "EDIT_BOOKMARK_CLOSE" });
                }

                if (bookmarkComponentType === "new_lowerUI") {
                  tabContext.tabVisDispatch({ type: "NEW_BOOKMARK_TOOGLE" });
                }
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

export default Bookmark_lowerUI_edit;
