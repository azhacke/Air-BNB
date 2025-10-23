const user = require("../models/user.js");


//render signup form and handle signup logic
module.exports.renderSignupForm = (req, res) => {
    res.render("users/signup.ejs");
};


//signup routes
module.exports.signupForm = async (req, res) => {
    try {
        let { username, password, email } = req.body;
        const newUser = new user({ username, password, email });
        await user.register(newUser, password);//register is a static method added by passport-local-mongoose to register a new user instance with a hashed password
        req.login(newUser, err => {
            if (err) return next(err);
            req.flash("success", "Welcome to Wanderlust!");
            res.redirect(req.originalUrligin || "/listings");
        });
    } catch (error) {
        req.flash("error", error.message);
        res.redirect("/signup");
    }

};


//render login form
module.exports.renderLoginForm = (req, res) => {
    res.render("users/login.ejs");
};


//login success logic
module.exports.loginSuccess = async (req, res) => {
    req.flash("success", "Welcome back to Wanderlust you are logged in!");
    res.redirect(res.locals.redirectUrl || "/listings");
};


//logout success logic
module.exports.logoutSuccess = (req, res, next) => {
    req.logout(function (err) {
        if (err) { return next(err); }
        req.flash("success", "You have logged out successfully!");
        res.redirect("/listings");
    });
};
