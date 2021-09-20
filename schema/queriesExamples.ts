

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


*/