export const TabsQuery = `query ($userId: ID) {
    tabs (userId: $userId) {
      id
      userId
      title
      color
      column
      priority
      opened
      openedByDefault
      deletable
      type
      noteInput
      rssLink
      date
      description
      itemsPerPage
    }
  }`;

export const BookmarksQuery = `query ($userId: ID) {
    bookmarks (userId: $userId) {
      id
      userId
      title
      URL
      tags
    }
  }`;

export const SettingsQuery = `query ($userId: ID) {
    settings (userId: $userId) {
    id
    userId
    picBackground
    defaultImage
    oneColorForAllCols
    limitColGrowth
    hideNonDeletable
    disableDrag
    numberOfCols
    date
    description
    itemsPerPage
    }
  }`;
