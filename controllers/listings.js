/**
 * Controllers for Listing routes.
 *
 * Exports:
 *  - index(req, res): GET /listings
 *      Renders list of all listings.
 *  - showRoute(req, res): GET /listings/:id
 *      Renders single listing with populated reviews and owner.
 *  - createRoute(req, res): POST /listings
 *      Normalizes image input, creates a new listing and assigns req.user._id as owner.
 *  - editRoute(req, res): GET /listings/:id/edit
 *      Renders edit form for a listing.
 *  - updateRoute(req, res): PUT /listings/:id
 *      Updates a listing using req.body.listing and redirects to the listing page.
 *  - deleteRoute(req, res): DELETE /listings/:id
 *      Deletes a listing and redirects.
 *  - newRoute(req, res): GET /listings/new
 *      Renders form for creating a new listing.
 *
 * Assumptions:
 *  - Express is used.
 *  - req.user is set (authentication middleware).
 *  - req.flash is available (connect-flash).
 *  - Listing is a Mongoose model.
 *
 * Error handling:
 *  - These controller methods are async but do not catch errors internally.
 *    Wrap them with an async error handler (e.g., a catchAsync utility or try/catch
 *    forwarding to next(err)) when wiring routes to avoid unhandled promise rejections.
 *
 * Example route wiring:
 *  const listings = require('../controllers/listings');
 *  router.get('/', listings.index);
 *  router.get('/new', isLoggedIn, listings.newRoute);
 *  router.post('/', isLoggedIn, listings.createRoute);
 *  router.get('/:id', listings.showRoute);
 *  router.get('/:id/edit', isLoggedIn, listings.editRoute);
 *  router.put('/:id', isLoggedIn, listings.updateRoute);
 *  router.delete('/:id', isLoggedIn, listings.deleteRoute);
 */
const express = require("express");
const Listing = require("../models/listing.js");


//index Route assync
module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
};

//show Route assync
module.exports.showRoute = async (req, res) => {
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
};


//Create Route assync
module.exports.createRoute = async (req, res) => {
    // normalize if old clients send a plain string
    if (req.body.listing && typeof req.body.listing.image === "string") {
        req.body.listing.image = { url: req.body.listing.image };
    }
    let url = req.file.url;
    let filename = req.file.originalname;
    req.body.listing.image = { url, filename };
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success", "Successfully created a new listing!");
    res.redirect("/listings");
};

//edit Route assync
module.exports.editRoute = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "listing Does Not Exist !....");
        return res.redirect("/listings");
    }
    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", '/upload/w_250/');
    listing.image.url = originalImageUrl;
    res.render("listings/edit.ejs", { listing });

};

//Update Route assync
module.exports.updateRoute = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing }, { new: true });
    if (typeof req.file !== "undefined") {
        let url = req.file.url;
        let filename = req.file.originalname;
        listing.image = { url, filename };
        await listing.save();
    }
    req.flash("success", "Successfully updated the listing!");
    res.redirect(`/listings/${listing._id}`);
};

//Delete Route assync
module.exports.deleteRoute = async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Successfully deleted the listing!");
    res.redirect("/");
};

//new Route
module.exports.newRoute = (req, res) => {
    res.render("listings/new.ejs");
}
