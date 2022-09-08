// selectable => either bookmarks of tags
export function createSelectablesRegex(singleSelectable: string) {
  let selectablesRegex = new RegExp(
    `(^|\\s+|,+|(\\s+,+)*|(,+\\s+)*)${singleSelectable}(\\s+|,+|(\\s+,+)*|(,+\\s+)*|$)`
  );
  return selectablesRegex;
}

// no commas allowed
export const singleCharRegex =
// /[\w~`!@#\$%\^&\*\(\)\-\+=\{\}\[\];:'"\\\|<>\./\?]/;
/[\w~`!@#$%^&*()\-+={}\[\];:'"\\|<>./?]/;

export function createSelectablesRegex_inverted_start(singleSelectable: string) {
    let selectablesRegex_inverted_start = new RegExp(`${singleCharRegex.source}+${singleSelectable}`)
    return selectablesRegex_inverted_start
}

export function createSelectablesRegex_inverted_end(singleSelectable: string) {
    let selectablesRegex_inverted_end = new RegExp(`${singleSelectable}${singleCharRegex.source}+`)
    return selectablesRegex_inverted_end;
}

// title for bookmark or tab
export const titleRegex = new RegExp(`^${singleCharRegex.source}(\\s?${singleCharRegex.source}+)*$`)

export const titleRegex_unflanked = new RegExp(`${singleCharRegex.source}(\\s?${singleCharRegex.source}+)*`)

export const tagsOrBookmarksRegexForSaving = new RegExp(
    `^${titleRegex_unflanked.source}(,\\s${titleRegex_unflanked.source})*,?$`
  );


/* 
old code - only /w characters were allowed in titles

let selectablesRegex = new RegExp(`\\b${el}\\b`);

 // const regexForBookmarks = /^\w(\s?\w+)*(,\s\w(\s?\w+)*)*,?$/;
// const regexForTitle = /^\w(\s?\w+)*$/;

*/
