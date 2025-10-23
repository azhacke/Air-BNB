const express = require("express");
const router = express.Router();
const user = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controllers/user.js");

//signup routes
router.get("/signup", userController.renderSignupForm);

router.post("/signup", wrapAsync(userController.signupForm));

router.get("/login", userController.renderLoginForm);


router.post(
    "/login",
    saveRedirectUrl,
    passport.authenticate("local", {//using local strategy for authentication
        failureFlash: true,//if no authentication then flash a message
        failureRedirect: "/login"//if no authentication then redirect to login page
    }),
    userController.loginSuccess
);

router.get("/logout", userController.logoutSuccess);

module.exports = router;