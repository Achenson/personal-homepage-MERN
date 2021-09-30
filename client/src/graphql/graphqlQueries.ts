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