
import {TabLocal_i} from "../types/tabType"


/* export const tabs: TabLocal_i[] = [
    {
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
      // items: [],
      rssLink: "https://feeds.theguardian.com/theguardian/uk-news/rss",
    },
  ]; */


  export const tabs: TabLocal_i[] = [
    {
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
      title: "note",
      color: null,
      column: 4,
      priority: 0,
      opened: true,
      openedByDefault: true,
      deletable: true,
      type: "note",
      noteInput: `Welcome to SmoothTabs (frontend demo),
  
  Manage bookmarks, RSS channels and notes in a form of draggable & foldable tabs
  
  Bypass CORS to allow RSS channels (https only) to work. On Chrome:
  1. Add new shortcut on the desktop
  2. Add the target as "[PATH_TO_CHROME]\chrome.exe" --disable-web-security --disable-gpu --user-data-dir=~/chromeTemp
  `,
    },
    {
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