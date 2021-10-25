import { SingleBookmarkData, SetBookmarkErrors } from "../interfaces";
import { bookmarkErrorsAllFalse as errorsAllFalse } from "../data/errors";

const urlRegexSafe = require("url-regex-safe");

export function bookmarkErrorHandling(
  titleInput: string,
  urlInput: string,
  tagsInputArr: string[],
  selectablesInputStr: string,
  notesTitlesArr: string[],
  rssTitlesArr: string[],
  bookmarks: SingleBookmarkData[],
  setErrors: SetBookmarkErrors,
  setSelectablesListVis: React.Dispatch<React.SetStateAction<boolean>>,
  componentType: "new_upperUI" | "new_lowerUI" | "edit",
  currentBookmark?: SingleBookmarkData | undefined
): boolean {
  // ^  and $ -> beginning and end of the text!
  // let regexForTags = /^\w+(,\s\w+)*$/;
  // let regexForTitle = /^\w+$/;
  const regexForTags = /^\w(\s?\w+)*(,\s\w(\s?\w+)*)*$/;
  const regexForTitle = /^\w(\s?\w+)*$/;
  // https://stackoverflow.com/questions/1500260/detect-urls-in-text-with-javascript
  // const regexForLink =
  //   /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi;

  if (!regexForTitle.test(titleInput)) {
    setErrors({
      ...errorsAllFalse,
      titleFormatErrorVis: true,
    });

    setSelectablesListVis(false);
    return true;
  }

  // !!! difference in Link_lower_JSX for edit type

  if (!titleUniquenessCheck()) {
    setErrors({
      ...errorsAllFalse,
      titleUniquenessErrorVis: true,
    });

    setSelectablesListVis(false);
    return true;
  }

  // if (!regexForLink.test(urlInput)) {
  if (!urlInput.match(urlRegexSafe({ exact: "true", strict: "true" }))) {
    setErrors({
      ...errorsAllFalse,
      invalidLinkVis: true,
    });

    setSelectablesListVis(false);
    return true;
  }

  if (
    !regexForTags.test(tagsInputArr.join(", ")) &&
    selectablesInputStr !== ""
  ) {
    setErrors({
      ...errorsAllFalse,
      tagErrorVis: true,
    });

    setSelectablesListVis(false);
    return true;
  }

  for (let el of tagsInputArr) {
    if (notesTitlesArr.indexOf(el) > -1) {
      setErrors({
        ...errorsAllFalse,
        noteErrorVis: true,
      });
      setSelectablesListVis(false);
      return true;
    }
  }

  for (let el of tagsInputArr) {
    if (rssTitlesArr.indexOf(el) > -1) {
      setErrors({
        ...errorsAllFalse,
        rssErrorVis: true,
      });
      setSelectablesListVis(false);
      return true;
    }
  }

  if (!tagUniquenessCheck()) {
    setErrors({
      ...errorsAllFalse,
      tagRepeatErrorVis: true,
    });
    setSelectablesListVis(false);
    return true;
  }

  return false;

  function tagUniquenessCheck() {
    let isUnique: boolean = true;

    tagsInputArr.forEach((el, i) => {
      let tagsInputCopy = [...tagsInputArr];
      tagsInputCopy.splice(i, 1);

      if (tagsInputCopy.indexOf(el) > -1) {
        isUnique = false;
        return;
      }
    });

    return isUnique;
  }

  function titleUniquenessCheck() {
    let isUnique: boolean = true;

    bookmarks.forEach((obj, i) => {
      if (obj.title === titleInput) {
        if (componentType !== "edit") {
          isUnique = false;
        } else {
          isUnique =
            titleInput === (currentBookmark as SingleBookmarkData).title
              ? true
              : false;
        }
      }
    });

    return isUnique;
  }
}
