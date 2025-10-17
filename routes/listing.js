const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema } = require("../schema.js");
const Listing = require("../models/listing.js");



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



//index route assync
router.get("/", wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
}));


//New Route
router.get("/new", (req, res) => {
    res.render("listings/new.ejs");
});


//show Route assync
router.get("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    if (!listing) {
        req.flash("error", "listing Does Not Exist !....");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing });
}));

//Create Route
router.post(
    "/",
    validateListing,
    wrapAsync(async (req, res) => {
        // normalize if old clients send a plain string
        if (req.body.listing && typeof req.body.listing.image === "string") {
            req.body.listing.image = { url: req.body.listing.image };
        }
        const newListing = new Listing(req.body.listing);
        await newListing.save();
        req.flash("success", "Successfully created a new listing!");
        res.redirect("/listings");
    })
);

//Edit Route assync
router.get("/:id/edit", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
}));

//Update Route assync
router.put("/:id",
    validateListing,
    wrapAsync(async (req, res) => {
        let { id } = req.params;
        if (req.body.listing && typeof req.body.listing.image === "string") {
            req.body.listing.image = { url: req.body.listing.image };
        }
        const listing = await Listing.findByIdAndUpdate(id, req.body.listing, { runValidators: true, new: true });
        req.flash("success", "Successfully updated the listing!");
        res.redirect(`/listings/${listing._id}`);
    }));


//Delete Route assync
router.delete("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Successfully deleted the listing!");
    res.redirect("/");
}));

module.exports = router;
