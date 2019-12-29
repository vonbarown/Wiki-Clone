require("dotenv").config();
const http = require("http");
const session = require("express-session");
const passport = require("passport");
const Auth0Strategy = require("passport-auth0");
const uid = require("uid-safe");

const express = require('express');
const next = require('next');
const cors = require('cors');
const bodyparser = require('body-parser');

const port = parseInt(process.env.PORT, 10) || 3000;
// 1 - boilerplate to get started with Next
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  // 2 - add session management to Express
  const sessionConfig = {
    secret: uid.sync(18),
    cookie: {
      maxAge: 86400 * 1000 // 24 hours in milliseconds
    },
    resave: false,
    saveUninitialized: true
  };
  server.use(session(sessionConfig));
  server.use(bodyparser.json());

  // 3 - configuring Auth0Strategy
  const auth0Strategy = new Auth0Strategy(
    {
      domain: process.env.AUTH0_DOMAIN,
      clientID: process.env.AUTH0_CLIENT_ID,
      clientSecret: process.env.AUTH0_CLIENT_SECRET,
      callbackURL: process.env.AUTH0_CALLBACK_URL
    },
    function (accessToken, refreshToken, extraParams, profile, done) {
      return done(null, profile);
    }
  );

  // 4 - configuring Passport
  passport.use(auth0Strategy);
  passport.serializeUser((user, done) => done(null, user));
  passport.deserializeUser((user, done) => done(null, user));

  // 5 - adding Passport and authentication routes
  server.use(passport.initialize());
  server.use(passport.session());

  // 6 - function to restrict access to routes
  const restrictAccess = (req, res, next) => {
    if (!req.isAuthenticated()) return res.redirect("/login");
    next();
  };

  // 7 - restricting access to some pages & files that you're going to make next
  server.use("/write", restrictAccess);
  server.use("/edit", restrictAccess);
  server.use("/api/*", restrictAccess);

  // 8 - handling routes with Next.js
  server.get("*", handle);

  // 9 - creating a port variable and listening on it
  const port = process.env.PORT || 8081;

  http.createServer(server).listen(port, () => {
    console.log(`listening on port ${port}`);
  });
});