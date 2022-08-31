import { SingleTabData } from "../../utils/interfaces";

interface TabDatabaseInit_i extends SingleTabData {
  userId: string;
}

export const tabsData: SingleTabData[] = [
  {
    id: "ALL_TAGS",
    title: "all bookmarks",
    color: "red-400",
    column: 1,
    priority: 1,
    opened: true,
    openedByDefault: true,
    deletable: false,
    type: "folder",
  },
  {
    id: "2",
    title: "main",
    color: null,
    column: 1,
    priority: 0,
    opened: false,
    openedByDefault: false,
    deletable: true,
    type: "folder",
  },
  {
    id: "3",
    title: "social",
    color: null,
    column: 2,
    priority: 0,
    opened: false,
    openedByDefault: false,
    deletable: true,
    type: "folder",
  },
  {
    id: "4",
    title: "fun",
    color: null,
    column: 2,
    priority: 1,
    opened: false,
    openedByDefault: false,
    deletable: true,
    type: "folder",
  },
  {
    id: "5",
    title: "info",
    color: null,
    column: 2,
    priority: 2,
    opened: false,
    openedByDefault: false,
    deletable: true,
    type: "folder",
  },
  {
    id: "6",
    title: "note",
    color: null,
    column: 4,
    priority: 0,
    opened: true,
    openedByDefault: true,
    deletable: true,
    type: "note",
    noteInput: `Welcome to SmoothTabs,

Manage bookmarks, notes and RSS channels in a form of draggable & foldable tabs.

Register to get persistent data storage and an option to upload picture as a background. Unregistered user's data is preserved until the browser data is cleared.

Tips & tricks:

SmoothTabs is preserving the content visibility of all tabs between reloads. You can reset (curly arrow in the upper left corner) the tabs' content visibility to a default state, which can be set differently for individual tabs.

Colors can be set either individually for each tab or separately for folders, notes and RSS channels. To reset all individual tab colors to corresponding tab type press RESET in "Default tab colors" settings menu.






`,
  },
  {
    id: "7",
    title: "guardian",
    color: null,
    column: 3,
    priority: 0,
    opened: false,
    openedByDefault: false,
    deletable: true,
    type: "rss",
    date: null,
    description: null,
    itemsPerPage: null,
    rssLink: "https://feeds.theguardian.com/theguardian/uk-news/rss",
  },
  {
    id: "8",
    title: "science alert",
    color: null,
    column: 3,
    priority: 1,
    opened: false,
    openedByDefault: false,
    deletable: true,
    type: "rss",
    date: null,
    description: null,
    itemsPerPage: null,
    rssLink: "https://feeds.feedburner.com/sciencealert-latestnews",
  },
  {
    id: "9",
    title: "tech beacon",
    color: null,
    column: 3,
    priority: 2,
    opened: false,
    openedByDefault: false,
    deletable: true,
    type: "rss",
    date: null,
    description: null,
    itemsPerPage: null,
    rssLink: "https://techbeacon.com/rss.xml",
  },
];

// crucial for zustand db to work (problems with )
export const tabsDataDbInit: TabDatabaseInit_i[] = [
  {
    id: "ALL_TAGS",
    userId: "",
    title: "all bookmarks",
    color: "red-400",
    column: 1,
    priority: 1,
    opened: true,
    openedByDefault: true,
    deletable: false,
    type: "folder",
  },

]


/*  RSS links for testing
Not working in production! due to mixed content (http request on https domain)
  "http://rss.cnn.com/rss/edition.rss"
  "http://rss.sciam.com/basic-science"

 [ // !!! RSS_reactQuery should run the second URL in case of error
    rssLink: "http://rss.sciam.com/basic-science",
    // rssLink: "http://rss.sciam.com/basic-science?format=xml", !!!]

   rssLink: "https://dailygalaxy.com/feed/",
    // rssLink: "https://tvn24.pl/najwazniejsze.xml",
    // rssLink: "https://feeds.feedburner.com/sciencealert-latestnews"
    // rssLink: "https://science.sciencemag.org/rss/twis.xml", <- works, but date & description unknown
    // rssLink: "https://techbeacon.com/rss.xml"  
    // rssLink:  "https://feeds.theguardian.com/theguardian/uk-news/rss"
*/
