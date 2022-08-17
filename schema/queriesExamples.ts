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
  backgroundImg(userId: "61b21a61cc1846bfa9ca8a8e") {
  backgroundImgUrl
 } */

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
  id
  userId
  title
  URL
  tags
  defaultFaviconFallback
}
}

 {
user(userId: "") {
  id
  name
  email
  password
  settings {
    id
    picBackground
  }
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
  changeUserByYser(id: "6151c1684589d00af404ab7e", name: "newName", email: "newEmail@mail", passwordCurrent: "secret") {
    name
       email
      error
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
        tags: ["61642206c38a6fc18f65a217", "61642206c38a6fc18f65a218", "61642206c38a6fc18f65a219"],
        defaultFaviconFallback: false
        ) {
         id
          userId
          title
          URL
          tags
  }
}



// not returning anything??
mutation {
  addUser(name: "test", email: "test@test", password: "test") {
    id
    name
    email
    password
    error
    settings {
      picBackground
    }
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


  mutation {
      login(email_or_name: John3, password: testwrong) {
      userId
      token
      error
    }
  }

  mutation {
	logout
}

  // not used clientside! for admin only in graphql playground?
  mutation {
      revokeRefreshToken(userId: "") {
      userId
      tokenVersion
    }
  }
  


// not used clientside! for admin only in graphql playground?
mutation {
  deleteUsersByAdmin (ids: ["62b1a1ca4c29c2e004161fe9", "62b1a2074c29c2e004162013"]) {
   ids {
    userId
    wasDeleted
  }
  }
}

// no example for backgroundImgUploadMutaion
// to test it -> Firecamp

mutation {
  forgotPassword(email: "ach.01.mail@gmail.com")
}

mutation {
	deleteAccountByUser(id: "", password: "") {
    name
    error
  }
}

mutation {
	changePasswordByUser(id: "", passwordCurrent: "", passwordNew: ""){
    name
    error
  }
}

mutation {
	changePasswordAfterForgot(token: "", newPassword: "") {
    userId
    token
    error
  }
  }



*/
