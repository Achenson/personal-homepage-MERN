import { NextFunction, Request, Response } from "express";

const jwt = require("jsonwebtoken");

interface ExpressReqResNext {
    req: Request;
    res: Response;
    next: NextFunction
  }

module.exports = (req: Request, res: Response, next: NextFunction) => {
  // headers are being set in indes.js on the client side!!!
  // and in there the access token is being taken from the redux store

  // console.log("req isAuth");
  // console.log(req);
  

  if(req) {
    
  const authHeader = req.get("Authorization");
  // console.log(req.headers);
  // const authHeader = req.headers.authorisation;
  console.log("req.headers isAuth");
    console.log(req.headers);

  console.log("authHeader isAuth");
  console.log(authHeader);

  // checking it there is in authorisation field in the incoming request
  if (!authHeader) {
    // request will travel through API, but with attached info that the user is not authorised
    console.log("no authHeader isAuth error");
    
    // @ts-ignore
    req.isAuth = false;
    // exiting function but the request continues
    return next();
  }
  // signalling which type of authentication we are using
  const token = authHeader.split(" ")[1]; // [[Authorization]]: Bearer faksldfasdf[tokenvalue]
  if (!token || token === "") {
   // @ts-ignore
    req.isAuth = false;
    return next();
  }
  let decodedToken;
  try {
    // decodedToken = jwt.verify(token, 'somesupersecretkey');
    decodedToken = jwt.verify(token, process.env.ACCESS);
  } catch (err) {
    // @ts-ignore
    req.isAuth = false;
    return next();
  }
  if (!decodedToken) {
    // @ts-ignore
    req.isAuth = false;
    return next();
  }
  // @ts-ignore
  req.isAuth = true;
  // @ts-ignore
  req.userId = decodedToken.userId;

  console.log("req.isAuth");
  // @ts-ignore
  console.log(req.isAuth);

  return next();
  }

  //  console.log("req.isAuth");
  // // @ts-ignore
  // console.log(req.isAuth);
  

  next()
};
