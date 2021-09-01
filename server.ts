const cors = require("cors");
const express = require("express");
const dotenv = require("dotenv");
const {graphqlHTTP} = require("express-graphql");
const helmet = require("helmet");
const mongoose = require("mongoose");
const schema = require("./schema/schema.ts");

const app = express();

const port = 4000;

import { Request, Response} from 'express';

app.use(helmet());

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:4000",
    ],
    credentials: true,
  })
);

app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    graphiql: true,
  })
);

dotenv.config();

const MONGODB_CONNECTION_STRING = process.env.DB;

mongoose
  .connect(MONGODB_CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("connection successful"))
  // .catch((err: Mon) => console.log(err));
  .catch(() => console.log("err"));

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!4");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
