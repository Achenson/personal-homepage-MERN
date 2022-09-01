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
    title: "about",
    color: null,
    column: 4,
    priority: 0,
    opened: true,
    openedByDefault: false,
    deletable: true,
    type: "note",
    noteInput: `Welcome to SmoothTabs,

Manage bookmarks, notes and RSS channels in a form of draggable & foldable tabs.

Register to get persistent data storage and an option to upload an image as a background. Unregistered user's data is preserved until the browser data is cleared.

Refer to tips & trick note for advanced usage.
`,
  },
  {
    id: "65",
    title: "tips & tricks",
    color: null,
    column: 4,
    priority: 1,
    opened: false,
    openedByDefault: false,
    deletable: true,
    type: "note",
    noteInput: `The content visibility of all tabs is being preserved between reloads. You can reset (curly arrow in the upper left section) the tabs' content visibility to default state, which can be set for individual tabs.

Tab colors can be set either individually or globally for bookmark folders, notes and RSS channels. In "Default tab colors" settings menu you can reset all individual tab colors to global configuration.

RSS settings can be controlled globally or separately for individual RSS channels. Each RSS tab can be reset back to global configuration.

Tabs can be dragged around by long pressing anywhere within the tab label. You can disable drag & drop in global settings if you encounter accidental tab dragging on a touchscreen.

Double click on a note's content for the fastest way to edit it.

Click a bookmark favicon to change it for default icon.

Bookmark folders are being deleted automatically when empty, except for "all bookmarks" folder.

Except for tabs' position rearranging, all SmoothTabs features can be controlled using keyboard.`,
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
];

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
