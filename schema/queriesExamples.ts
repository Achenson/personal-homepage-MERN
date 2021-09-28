// QUERIES ====================================

/* {
 settings(userId: "123") {
  picBackground
}
}    */

/* {
  settings(userId: "61489020ea91621bf07ebb31") {
   picBackground
   user {
     name,
     email
   }
 }
 }     */


/*  {
  tabs(userId: "6151ad9d50ce1ecf5f813f01") {
    title
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




*/