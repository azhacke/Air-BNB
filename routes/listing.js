const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
// const { index, showRoute, createRoute,editRoute, updateRoute, deleteRoute } = require("../controllers/listings.js");
const listingController = require("../controllers/listings.js");



//index route assync
router.get("/", wrapAsync(listingController.index));


//New Route
router.get("/new", isLoggedIn, listingController.newRoute);


//show Route assync
router.get("/:id",
    wrapAsync(listingController.showRoute));

//Create Route
router.post(
    "/",
    isLoggedIn,
    validateListing,
    wrapAsync(listingController.createRoute)
);

//Edit Route assync
router.get("/:id/edit",
    isLoggedIn,
    isOwner,
    wrapAsync(listingController.editRoute));

//Update Route assync
router.put("/:id",
    isLoggedIn,
    validateListing,
    isOwner,
    wrapAsync(listingController.updateRoute));


//Delete Route assync
router.delete("/:id",
    isLoggedIn,
    isOwner,
    wrapAsync(listingController.deleteRoute));

module.exports = router;
