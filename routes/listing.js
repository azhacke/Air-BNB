const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");





//index route assync
router.get("/", wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
}));


//New Route
router.get("/new", isLoggedIn, (req, res) => {
    res.render("listings/new.ejs");
});


//show Route assync
router.get("/:id",
    wrapAsync(async (req, res) => {
        let { id } = req.params;
        const listing = await Listing.findById(id)
            .populate({
                path: "reviews",
                populate: { path: "author" }
            })
            .populate("owner");
        if (!listing) {
            req.flash("error", "listing Does Not Exist !....");
            res.redirect("/listings");
        }
        // console.log(listing);
        res.render("listings/show.ejs", { listing });
    }));

//Create Route
router.post(
    "/",
    isLoggedIn,
    validateListing,
    wrapAsync(async (req, res) => {
        // normalize if old clients send a plain string
        if (req.body.listing && typeof req.body.listing.image === "string") {
            req.body.listing.image = { url: req.body.listing.image };
        }
        const newListing = new Listing(req.body.listing);
        newListing.owner = req.user._id;
        await newListing.save();
        req.flash("success", "Successfully created a new listing!");
        res.redirect("/listings");
    })
);

//Edit Route assync
router.get("/:id/edit",
    isLoggedIn,
    isOwner,
    wrapAsync(async (req, res) => {
        let { id } = req.params;
        const listing = await Listing.findById(id);
        res.render("listings/edit.ejs", { listing });
    }));

//Update Route assync
router.put("/:id",
    isLoggedIn,
    validateListing,
    isOwner,
    wrapAsync(async (req, res) => {
        let { id } = req.params;
        await Listing.findByIdAndUpdate(id, { ...req.body.listing });
        req.flash("success", "Successfully updated the listing!");
        res.redirect(`/listings/${listing._id}`);
    }));


//Delete Route assync
router.delete("/:id",
    isLoggedIn,
    isOwner,
    wrapAsync(async (req, res) => {
        let { id } = req.params;
        await Listing.findByIdAndDelete(id);
        req.flash("success", "Successfully deleted the listing!");
        res.redirect("/");
    }));

module.exports = router;
