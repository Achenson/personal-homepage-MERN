// QUERIES ====================================

/* {
 settings(userId: "123") {
  id
  userId
  picBackground
  defaultImage
  oneColorForAllCols
  limitColGrowth
  hideNonDeletable
  disableDrag
  numberOfCols
}
}    */

/* {
  tabs(userId: "6154708145808b7678b78762") {
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
} */

/*

{
bookmarks(userId: "") {
  id,
  userId,
  title,
  URL,
  tags
}
}

*/

// MUTATIONS ===================================

/* 
mutation {
  changeSettings(userId: "123", picBackground: true,
        defaultImage: "img" ,
        oneColorForAllCols: true,
        limitColGrowth: true,
        hideNonDeletable: true,
        disableDrag: true,
        numberOfCols: 2,
) {
        picBackground,
        defaultImage,
        oneColorForAllCols,
        limitColGrowth,
        hideNonDeletable,
        disableDrag,
        numberOfCols
  }
}

mutation {
  changeUser(id: "6151c1684589d00af404ab7e", name: "newName", email: "newEmail@mail", password: "secret") {
    name
  }
}

mutation {
  changeTab(id: "6151c1684589d00af404ab82", title: "newFolder", color: "red-900", column: 2, priority: 0,
    opened: false, openedByDefault: false, deletable: false, type: "folder") {
    title
  }
}



mutation {
  changeBookmark(id: "61642207c38a6fc18f65a22a", userId: "61642206c38a6fc18f65a214",
        title: "facebooknewww",
        URL: "https://www.facebook.com/",
        tags: ["61642206c38a6fc18f65a217", "61642206c38a6fc18f65a218", "61642206c38a6fc18f65a219"]) {
         id
          userId
          title
          URL
          tags
  }
}

"id": "616d8500e1ea080b82f05e66",
  "userId": "616d84ffe1ea080b82f05e50",
  "title": "facebook",
  "URL": "https://www.facebook.com/",
  "tags": [
    "616d84ffe1ea080b82f05e53",
    "616d84ffe1ea080b82f05e54",
    "616d84ffe1ea080b82f05e55",
    "616e89e35ba12b820740f82a",
    "616e8a215ba12b820740f82e"







// not returning anything??
mutation {
  addUser(name: "John3", email: "test@test", password: "test") {
    id
    name
    email
    password
    settings {
      picBackground
    }
  }
}


mutation {
  deleteUser(id: "6151a40ae708770664219b71") {
    name
  }
}

mutation {
 deleteBookmark(id: "6151ad9d50ce1ecf5f813f0b") {
  title
}
}


mutation {
  addTab(userId: "", title: "testTab", color: "red-400",
   column: 1, priority: 0, opened: true, openedByDefault: false,
    deletable: true, type: "folder") {
    title
  }
}


mutation {
  deleteTab(id: "" {
    title
  }
}


mutation {
  addBookmark(userId: "616d84ffe1ea080b82f05e50", title: "testBookmark", URL: "https://mongoosejs.com/docs/search.html?q=save", tags: ["616d84ffe1ea080b82f05e53"]) {
    id
    userId
    title
    URL
    tags
  }
}




*/
