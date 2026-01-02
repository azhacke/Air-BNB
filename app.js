const path = require("path");
if (process.env.NODE_ENV !== "production") {
    // require("dotenv").config({ path: path.resolve(__dirname, "..", ".env") });
    require("dotenv").config();
}

const express = require("express");
const app = express(); let port = 5001;
const mongoose = require("mongoose");
// `path` is already required above for dotenv path resolution
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");//module
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");


const lisingsRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

// let parseRoute;
const MONGO_URL = "mongodb://localhost:27017/wanderlust";


//Database Connection
main()
    .then(() => console.log("Connected to MongoDB"))
    .catch(err => console.log(err));
async function main(params) {
    await mongoose.connect(MONGO_URL);
}

//Middleware
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));//this is to use files in public folder

const sessionsOptions = {
    secret: "mysupersecretcode",
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,//1 week from now
        maxAge: 1000 * 60 * 60 * 24 * 7,//1 week
        httpOnly: true,
    }
};

//Home Route
app.get("/", (req, res) => {
    res.redirect("/listings");
});

//session configuration
app.use(session(sessionsOptions));
app.use(flash());

//passport configuration
app.use(passport.initialize());//initialize passport
app.use(passport.session());//use passport session is needed for persistent login sessions if the user is logged in and changes pages he should remain logged in
passport.use(new LocalStrategy(User.authenticate()));//this is to set up passport to use local strategy for authentication using the authenticate method on the User model

passport.serializeUser(User.serializeUser());//to store user info in session unpack it into a user object
passport.deserializeUser(User.deserializeUser());//to retrieve user info from session and pack it back into a user object


//flash middlewares
app.use(((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currentUser = req.user;
    next();
}));

// app.get("/demouser", async (req, res) => {
//     let fakeUser = new User({
//          username: "demouser",
//          email: "demouser@example.com" 
//         });
//         let registeredUser = await User.register(fakeUser, "demopassword");//this will hash the password and store it in the database
//         // await fakeUser.save();
//         res.send(registeredUser);
// });

//routes configuration
app.use("/listings", lisingsRouter); // Use the listing routes defined in routes/listing.js
app.use("/listings/:id/reviews", reviewsRouter); // Use the review routes defined in routes/review.js
app.use("/", userRouter); // Use the user routes defined in routes/user.js

{
    // 404 fallback — use app.use so Express doesn't re-parse a route pattern here
    app.use((req, res, next) => {
        next(new ExpressError(404, "Page Not Found!"));
    });
}


// error handler — respond with proper status and message
app.use((err, req, res, next) => {
    const { statusCode = 500, message = "Something went wrong" } = err;
    // res.status(statusCode).send(message);
    res.render("error.ejs", { err });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

