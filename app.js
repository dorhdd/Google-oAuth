const PORT = 3000;
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const passport = require("passport");
const cookieSession = require("cookie-session");
require("./passport-setup");

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(
  cookieSession({
    name: "session",
    keys: ["key1", "key2"],
  })
);
const isLogged = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    res.sendStatus(401);
  }
};
app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req, res) => {
  res.sendFile("./public/index.html", { root: __dirname });
});
app.get("/login", (req, res) => res.send("Login failed"));
app.get("/success", isLogged, (req, res) => {
  res.sendFile("./public/logout.html", { root: __dirname });
});

app.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  function (req, res) {
    res.redirect("/success");
  }
);

app.get("/logout", (req, res) => {
  req.session = null;
  req.logout("/");
  res.redirect("/");
});

app.listen(PORT);
