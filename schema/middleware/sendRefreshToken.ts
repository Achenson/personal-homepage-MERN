import {Request, Response} from "express"

module.exports = (res: Response, token: String) => {
  console.log("SENDING REFRESH TOKEN");
  // console.log("SENDING REFRESH TOKEN");
  
    res.cookie("jid", token, {
      httpOnly: true,
      // to prevent sending cookie in every request
      // path: "/refresh_token",
      // if expires is not set, the cookie will be session only
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      // sameSite is set to "lax" in modern browsers, but it still should be specified
      sameSite: "lax",
    });
  };
  