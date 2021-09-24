export const tabs = [
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