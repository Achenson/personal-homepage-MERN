import { BookmarkLocal_i } from "../types/bookmarkType";

/* export const bookmarks: BookmarkLocal_i[]  = [
    {
      title: "facebook",
      URL: "https://www.facebook.com/",
      tagIndices: [0]
    },
    {
      title: "gmail",
      URL: "https://mail.google.com/mail/u/0/",
      tagIndices: [0, 1]
    },
  ]; */

export const bookmarks: BookmarkLocal_i[] = [
  {
    title: "facebook",
    URL: "https://www.facebook.com/",
    tagIndices: [0, 1, 2],
    defaultFaviconFallback: false
    // tags: ["ALL_TAGS", "2", "3"],
  },
  {
    title: "gmail",
    URL: "https://mail.google.com/mail/u/0/",
    tagIndices: [0, 1],
    defaultFaviconFallback: false
    // tags: ["ALL_TAGS", "2"],
  },
  {
    title: "twitter",
    URL: "https://twitter.com/",
    tagIndices: [0, 2],
    defaultFaviconFallback: false
    // tags: ["ALL_TAGS", "3"],
  },
  {
    title: "reddit",
    URL: "https://www.reddit.com/",
    tagIndices: [0, 2],
    defaultFaviconFallback: false
    // tags: ["ALL_TAGS", "3"],
  },
  {
    title: "metacritic",
    URL: "https://www.metacritic.com/",
    tagIndices: [0, 3],
    defaultFaviconFallback: false
    // tags: ["ALL_TAGS", "4"],
  },
  {
    title: "spotify",
    URL: "https://open.spotify.com",
    tagIndices: [0, 4],
    defaultFaviconFallback: false
    // tags: ["ALL_TAGS", "4"],
  },
  {
    title: "youtube",
    URL: "https://www.youtube.com/",
    tagIndices: [0, 1, 3],
    defaultFaviconFallback: false
    // tags: ["ALL_TAGS", "2", "4"],
  },
  {
    title: "bbc",
    URL: "https://www.bbc.com/",
    tagIndices: [0, 4],
    defaultFaviconFallback: false
    // tags: ["ALL_TAGS", "5"],
  },
  {
    title: "the economist",
    URL: "https://www.economist.com/",
    tagIndices: [0, 4],
    defaultFaviconFallback: false
    // tags: ["ALL_TAGS", "5"],
  },
];
