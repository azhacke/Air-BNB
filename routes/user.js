const express = require("express");
const router = express.Router();
const user = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");

router.get("/signup", (req, res) => {
    res.render("users/signup.ejs");
});

router.post("/signup", wrapAsync(async (req, res) => {
    try {
        let { username, password, email } = req.body;
        const newUser = new user({ username, password, email });
        await user.register(newUser, password);//register is a static method added by passport-local-mongoose to register a new user instance with a hashed password
        req.login(newUser, err => {
            if (err) return next(err);
            req.flash("success", "Welcome to Wanderlust!");
            res.redirect("/listings");
        });
    } catch (error) {
        req.flash("error", error.message);
        res.redirect("/signup");
    }

}));

router.get("/login", (req, res) => {
    res.render("users/login.ejs");
});

router.post("/login",  passport.authenticate("local", {//using local strategy for authentication
    failureFlash: true,//if no authentication then flash a message
    failureRedirect: "/login"//if no authentication then redirect to login page
}), async (req, res) => {
    req.flash("success", "Welcome back to Wanderlust you are logged in!");
    const redirectUrl = req.session.returnTo || "/listings";
    delete req.session.returnTo;
    res.redirect(redirectUrl);
});

module.exports = router;