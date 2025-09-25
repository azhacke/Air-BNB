const express = require("express");
const app = express(); let port = 5001;
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");//module
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const { asyncWrapProviders } = require("async_hooks");
const { listingSchema, reviewSchema } = require("./schema.js");
const Review = require("./models/review.js");
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

// validate listing middleware
const validateListing = (req, res, next) => {//why do we need this when we have schema validation in model
    //what does this function do here
    //this function is a middleware that validates the incoming request body against the Joi schema
    const { error } = listingSchema.validate(req.body);
    // console.log(error);
    if (error) {
        let errMsg = error.details.map(el => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
}; 


// validate review middleware
const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map(el => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next(); //what does next do here?
        //next is a function in the Express router which, when invoked, executes the middleware succeeding the current middleware
    }
};

//index route assync
app.get("/listings", wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
}));


//New Route
app.get("/listings/new", (req, res) => {
    res.render("listings/new.ejs");
});


//show Route assync
app.get("/listings/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    res.render("listings/show.ejs", { listing });
}));

//Create Route
app.post(
    "/listings",
    validateListing,
    wrapAsync(async (req, res) => {
        // normalize if old clients send a plain string
        if (req.body.listing && typeof req.body.listing.image === "string") {
            req.body.listing.image = { url: req.body.listing.image };
        }
        const newListing = new Listing(req.body.listing);
        await newListing.save();
        res.redirect("/listings");
    })
);

//Edit Route assync
app.get("/listings/:id/edit", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
}));

//Update Route assync
app.put("/listings/:id",
    validateListing,
    wrapAsync(async (req, res) => {
        let { id } = req.params;
        if (req.body.listing && typeof req.body.listing.image === "string") {
            req.body.listing.image = { url: req.body.listing.image };
        }
        const listing = await Listing.findByIdAndUpdate(id, req.body.listing, { runValidators: true, new: true });
        res.redirect(`/listings/${listing._id}`);
    }));


//Delete Route assync
app.delete("/listings/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
}));

//reviews post route
app.post("/listings/:id/reviews", validateReview, wrapAsync(async (req, res) => {
    let listing = await Listing.findById(req.params.id);//why we need to find the listing here
    let newReview = new Review(req.body.review);//what is happening in this line

    listing.reviews.push(newReview);//what is happening in this line

    await newReview.save();//why using .save here
    await listing.save();//why using .save here

    console.log("New Review Added");
    // Redirect to the listing page after adding the review
    res.redirect(`/listings/${listing._id}`);
})
);

//Delete route
// app.delete("/listings/:id", async (req, res) => {
//     let { id } = req.params;
//     await Listing.findByIdAndDelete(id);
//     res.redirect("/listings");
// });


//this is for handling all other routes which are not defined
// default route
// app.get("*", (req, res) => {
//     res.render("listings/default.ejs");
// });

//Test Listening
// app.get("/testListing", async (req, res) => {
//     let sampleListing = new Listing({
//         title: "Sample Listing",
//         description: "This is near beach",
//         images: "https://images.unsplash.com/photo-1590523278191-995cbcda646b?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max&ixid=eyJhcHBfaWQiOjEyMDd9",
//         price: 1200,
//         location: "Andhara Pradesh",
//         country: "INDIA"
//     });
//     await sampleListing.save().then(() => {
//         console.log("Sample listing Saved");
//         res.send("Test endpoint");
//     }).catch(err => console.log("This is error", err));
// });

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

