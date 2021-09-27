
import {TabLocal_i} from "../types/tabType"

export const tabs: TabLocal_i[] = [
    {
      title: "all bookmarks",
      color: "red-400",
      column: 1,
      priority: 1,
      opened: true,
      openedByDefault: true,
      deletable: false,
      type: "ALL_TAGS",
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
  ];