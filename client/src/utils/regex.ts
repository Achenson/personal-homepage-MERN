// const escapeRegExp = import("lodash.escaperegexp")
const escapeRegExp = require("lodash.escaperegexp");
// selectable => either bookmarks of tags
export function createSelectablesRegex(singleSelectable: string) {
  let singleSelectableEscaped = escapeRegExp(singleSelectable);

  let selectablesRegex = new RegExp(
    // `(^|\\s+|,+|(\\s+,+)*|(,+\\s+)*)${singleSelectable}(\\s+|,+|(\\s+,+)*|(,+\\s+)*|$)`
    `(^|\\s+|,+|(\\s+,+)*|(,+\\s+)*)${singleSelectableEscaped}(\\s+|,+|(\\s+,+)*|(,+\\s+)*|$)`
  );
  return selectablesRegex;
}

// no commas allowed
export const singleCharRegex =
  // /[\w~`!@#\$%\^&\*\(\)\-\+=\{\}\[\];:'"\\\|<>\./\?]/;
  /[\w~`!@#$%^&*()\-+={}\[\];:'"\\|<>./?]/;

export function createSelectablesRegex_inverted_start(
  singleSelectable: string
) {
  let singleSelectableEscaped = escapeRegExp(singleSelectable);
  let selectablesRegex_inverted_start = new RegExp(
    `${singleCharRegex.source}+${singleSelectableEscaped}`
  );
  return selectablesRegex_inverted_start;
}

export function createSelectablesRegex_inverted_end(singleSelectable: string) {
  let singleSelectableEscaped = escapeRegExp(singleSelectable);
  let selectablesRegex_inverted_end = new RegExp(
    `${singleSelectableEscaped}${singleCharRegex.source}+`
  );
  return selectablesRegex_inverted_end;
}

// title for bookmark or tab
export const titleRegex = new RegExp(
  `^${singleCharRegex.source}(\\s?${singleCharRegex.source}+)*$`
);

export const titleRegex_unflanked = new RegExp(
  `${singleCharRegex.source}(\\s?${singleCharRegex.source}+)*`
);

export const tagsOrBookmarksRegexForSaving = new RegExp(
  `^${titleRegex_unflanked.source}(,\\s${titleRegex_unflanked.source})*,?$`
);

/* 
old code - only /w characters were allowed in titles

let selectablesRegex = new RegExp(`\\b${el}\\b`);

 // const regexForBookmarks = /^\w(\s?\w+)*(,\s\w(\s?\w+)*)*,?$/;
// const regexForTitle = /^\w(\s?\w+)*$/;

*/
