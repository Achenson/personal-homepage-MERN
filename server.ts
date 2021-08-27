const cors = require("cors");
const express = require("express");
const dotenv = require("dotenv");
const {graphqlHTTP} = require("express-graphql");
const helmet = require("helmet");
const schema = require("./schema/schema.ts");

const app = express();

const port = 4000;

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

// dotenv.config();

// const MONGODB_CONNECTION_STRING = process.env.DB;

// mongoose
//   .connect(MONGODB_CONNECTION_STRING, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => console.log("connection successful"))
//   .catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("Hello World!2");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
