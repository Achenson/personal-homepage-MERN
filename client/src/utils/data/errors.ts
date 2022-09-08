import { BookmarkErrors, TabErrors } from "../interfaces";

export const bookmarkErrors = {
  titleFormat:
    // "Title can contain letters, numbers, underscores and single spaces",
    // "Start and end the title with a letter, digit or underscore. Commas and multiple spaces are not allowed",
    "Title cannot start or end with spaces. Commas and multiple spaces are not allowed",
  titleUniqueness: "Bookmark with that title already exists",
  // tagFormat: "Folders should consist of words separated by coma and single space",
  tagFormat:
    // "Folders should consist of letters, numbers, underscores, single spaces separated by coma and space",
    "Enter folder titles (starting and ending with a character, no commas or multiple spaces), separated by comma and space",
  noteError: "Folder names cannot be the same as Note titles",
  rssError: "Folder names cannot be the same as RSS titles",
  tagRepeat: "Each folder should be unique",
  invalidLink:
    "Invalid URL. Try copying URL directly from your browser address bar",
};

export const bookmarkErrorsAllFalse: BookmarkErrors = {
  tagErrorVis: false,
  tagRepeatErrorVis: false,
  titleFormatErrorVis: false,
  titleUniquenessErrorVis: false,
  noteErrorVis: false,
  rssErrorVis: false,
  invalidLinkVis: false,
};

export const tabErrors = {
  // titleFormat: "Tab title should consist of words without special characters",
  titleFormat:
    // "Title can contain letters, numbers, underscores and single spaces",
    // "Start and end the title with a letter, digit or underscore. Commas and multiple spaces are not allowed",
    bookmarkErrors.titleFormat,
  // not used in edit tab
  titleUniqueness: "Tab with that title already exists",
  invalidLinkError: "Invalid link",
  invalidLinkHttpsError: "RSS links should be https only",
  bookmarksFormat:
    // "Bookmarks should consist of letters, numbers, underscores, single spaces separated by coma and space",
    // "Enter bookmark titles (starting and ending with a letter, digit or underscore, single spaces are allowed), separated by coma and space",
    "Enter bookmark titles (starting and ending with a character, no commas or multiple spaces), separated by comma and space",
  bookmarkExistence: "You can choose from existing bookmarks only",
  bookmarksRepeat: "Each bookmark should be unique",
  // note only
  textArea: "Note cannot be empty",
  // not deletabe folder only
  noDeletion:
    "Folder with all bookmarks cannot be deleted. You can hide it in the global settings instead",
};

export const tabErrorsAllFalse: TabErrors = {
  bookmarksErrorVis: false,
  bookmarksRepeatErrorVis: false,
  titleFormatErrorVis: false,
  titleUniquenessErrorVis: false,
  bookmarkExistenceErrorVis: false,
  textAreaErrorVis: false,
  invalidLinkErrorVis: false,
  invalidLinkErrorHttpsVis: false,
  // for EditTab only
  noDeletionErrorVis: false,
};
