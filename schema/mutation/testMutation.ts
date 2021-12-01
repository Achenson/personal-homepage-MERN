const graphql = require("graphql");

// const Bookmark = require("../../mongoModels/bookmarkSchema");



/* import {
  BookmarkFields,
  BookmarkType,
  BookmarkDatabase_i,
} from "../types/bookmarkType"; */

import {TestMutationField, TestMutationType} from "../types/testMutationType"

export const testMutationField = {
  type: TestMutationType,
  args: {
    ...TestMutationField,
  },
//   resolve(_source: unknown, args: {stringToAdd: string}) {
  resolve(rootValue: any) {



    /* console.log("args.stringToAdd");
    console.log(args.stringToAdd); */

    
    // console.log(rootValue.request.params);
    
    console.log(rootValue.request.customKey);
    
    /* console.log(typeof rootValue);
    // console.log(JSON.stringify(rootValue.request, null, 2));

    /* console.log("dddd");
    
    
    
    let test = JSON.parse(rootValue)
    console.log(test); */
    

   /*  let newBookmark = new Bookmark({
      userId: args.userId,
      title: args.title,
      URL: args.URL,
      tags: args.tags,
    });

    return new Promise((resolve, reject) => {
      newBookmark.save((err: Error, bookmarkProduct: BookmarkDatabase_i) => {
        if (err) {
          console.log(err);
          reject(err);
        }
        console.log(bookmarkProduct);
        resolve(bookmarkProduct);
      });
    });
 */



  },
};
