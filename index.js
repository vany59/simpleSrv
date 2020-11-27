const express = require("express");
var bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { OK, UNAUTH, ERROR } = require("./res");
const Db = require("./db");
const { response } = require("express");

const saltRounds = 10;
const secret = "token";

const app = express();
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;

app.listen(PORT);
console.log(`Server is running on: http://localhost:${PORT}`);

const User = new Db("user");
const Stock = new Db("stock");
console.log(`Connected to databse`);

app.get("/", (req, res) => {
  const { query } = req;
  console.log(query);
  res.send("ok");
});

app.post("/signup", (req, res) => {
  try {
    const {
      body: { username, password },
    } = req;
    const hassPassword = bcrypt.hashSync(password, saltRounds);
    const existedUser = User.findOne({ username });
    console.log(existedUser);
    if (existedUser) throw new Error("user existed");
    User.save({ username, password: hassPassword });
    res.send(OK());
  } catch (e) {
    res.send(ERROR(e.message));
  }
});

app.post("/login", (req, res) => {
  try {
    const {
      body: { username, password },
    } = req;
    const user = User.findOne({ username });
    if (!user) throw new ERROR("unauth");
    const isPasswordCorrect = bcrypt.compareSync(password, user.password);
    if (!isPasswordCorrect) throw new Error("unauth");
    const token = jwt.sign({ username }, secret);
    res.send(OK({ access_token: token }));
  } catch (e) {
    res.send(UNAUTH());
  }
});

function authUser(req, res, next) {
  try {
    const {
      headers: { authorization },
    } = req;
    if (!authorization) throw new Error("unauth");
    const token = authorization.split(" ")[1];
    const { username } = jwt.verify(token, secret);
    const user = User.findOne({ username });
    if (!user) throw new Error("unauth");
    req.username = username;
    next();
  } catch (e) {
    res.send(UNAUTH());
  }
}

app.get("/stock/list", authUser, (req, res) => {
  const stocks = Stock.find();
  res.send(OK(stocks));
});

app.post("/stock/create", authUser, (req, res) => {
  try {
    const { body } = req;
    Stock.save(body);
    res.send(OK());
  } catch (e) {
    res.send(ERROR(e));
  }
});

app.post("/list", (req, res) => {
  console.log(req.headers);
  res.send(
    OK([
      { title: "123", description: "abc" },
      { title: "456", description: "def" },
    ])
  );
});
