const express = require("express");
const app = express(); let port = 5001;
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");//module
const ExpressError = require("./utils/ExpressError.js");

const lisings = require("./routes/listing.js");
const reviews = require("./routes/review.js");


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


//Home Route
app.get("/", (req, res) => {
    res.redirect("/listings");
});

app.use("/listings",lisings); // Use the listing routes defined in routes/listing.js
app.use("/listings/:id/reviews", reviews);// Use the review routes defined in routes/review.js


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

