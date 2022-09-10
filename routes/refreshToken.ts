import express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

const createAccessToken = require("../schema/middleware/accessToken");
const createRefreshToken = require("../schema/middleware/refreshToken");
const sendRefreshToken = require("../schema/middleware/sendRefreshToken");

import { RequestWithAuth } from "../schema/middleware/isAuth";
import User = require("../mongoModels/userSchema");
import { Response } from "express";

// @ts-ignore
router.post("/", async (req: RequestWithAuth, res: Response) => {
  console.log("refresh token app.post");
  // testing sending cookie after cookie-parser is applied
  console.log(req.cookies);
  const token = req.cookies.jid;

  if (!token) {
    return res.status(401).send({ ok: false, accessToken: null, userId: null });
  }

  let payload = null;

  try {
    payload = jwt.verify(token, process.env.REFRESH as string);
  } catch (err) {
    console.log(err);
    console.log("refresh token error2");
    // unauthorised
    return res.status(401).send({ ok: false, accessToken: null, userId: null });
  }

  // token is valid
  // we can send access token
  // @ts-ignore
  const user = await User.findById(payload.userId);

  if (!user) {
    console.log("refresh token error3");
    return res.status(500).send({ ok: false, accessToken: null, userId: null });
  }

  // revoking tokens: tokenVersion == 0 when creating user
  // refreshTokens' tokenVersion == user.tokenVerssion
  // to invalidate user -> increment user's tokenVersion
  // when the user tries to refresh tokens(refreshing or after accessToken runs out),
  // his user.tokenVersion doesn't match the version from the refresh token in his cookies

  if (user.tokenVersion !== payload.tokenVersion) {
    console.log("invalid tokenVersion");
    return res.status(401).send({ ok: false, accessToken: null, userId: null });
  }

  await sendRefreshToken(res, createRefreshToken(user));

  return res.status(201).send({
    ok: true,
    accessToken: createAccessToken(user),
    userId: payload.userId,
  });
});
module.exports = router;
