const express = require("express");
const passport = require("passport");

// 1. Create an Express Router
const router = express.Router();

// 2. Create a login route, which authenticates via Auth0, then redirects to callback
router.get("/login", passport.authenticate("auth0", {
    scope: "openid email profile"
}), (req, res) => res.redirect("/"));

// 3. Create a callback route, which decides where user is redirected after being logged in
router.get("/callback", (req, res, next) => {
    passport.authenticate("auth0", (err, user) => {
        if (err) return next(err);
        if (!user) return res.redirect("/login");
        req.logIn(user, (err) => {
            if (err) return next(err);
            res.redirect("/");
        });
    })(req, res, next);
});

// 4. Create route which logs user out from Auth0, then redirects them to BASE_URL
router.get("/logout", (req, res) => {
    req.logout();

    const { AUTH0_DOMAIN, AUTH0_CLIENT_ID, BASE_URL } = process.env;
    res.redirect(`https://${AUTH0_DOMAIN}/logout?client_id=${AUTH0_CLIENT_ID}&returnTo=${BASE_URL}`);
});

module.exports = router;