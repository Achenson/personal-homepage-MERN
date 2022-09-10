const jwt = require("jsonwebtoken");

import { NextFunction, Request, Response } from "express";

export interface RequestWithAuth extends Request {
  isAuth: true | false;
  userId: string | null;
}

module.exports = (req: RequestWithAuth, res: Response, next: NextFunction) => {
  // headers are being set in App on the client side!!!
  // and in there the access token is being taken from central state

  if (req) {
    const authHeader = req.get("Authorization");
    // checking it there is in authorisation field in the incoming request
    if (!authHeader) {
      // request will travel through API, but with attached info that the user is not authorised
      console.log("no authHeader isAuth error");
      req.isAuth = false;
      // exiting function but the request continues
      return next();
    }

    // signalling which type of authentication we are using
    const token = authHeader.split(" ")[1]; // [[Authorization]]: Bearer faksldfasdf[tokenvalue]
    if (!token || token === "") {
      req.isAuth = false;
      req.userId = null;
      return next();
    }
    let decodedToken;
    try {
      decodedToken = jwt.verify(token, process.env.ACCESS);
    } catch (err) {
      req.isAuth = false;
      req.userId = null;
      return next();
    }
    if (!decodedToken) {
      req.isAuth = false;
      req.userId = null;
      return next();
    }

    req.isAuth = true;
    req.userId = decodedToken.userId;

    console.log("req.isAuth");
    console.log(req.isAuth);

    next();
  }

  if (!req) {
    next();
  }
};
