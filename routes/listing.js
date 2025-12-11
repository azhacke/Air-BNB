const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
// const { index, showRoute, createRoute,editRoute, updateRoute, deleteRoute } = require("../controllers/listings.js");
const listingController = require("../controllers/listings.js");

router.route("/")
    //index route assync
    .get(wrapAsync(listingController.index))
    //Create Route
    .post(
        isLoggedIn,
        validateListing,
        wrapAsync(listingController.createRoute)
    );


//New Route (must come before `/:id` so 'new' isn't treated as an id)
router.get("/new", isLoggedIn, listingController.newRoute);

//Edit Route (must come before `/:id`)
router.get("/:id/edit",
    isLoggedIn,
    isOwner,
    wrapAsync(listingController.editRoute));


router.route("/:id")
    //show Route assync
    .get(wrapAsync(listingController.showRoute))
    //Update Route assync
    .put(
        isLoggedIn,
        validateListing,
        isOwner,
        wrapAsync(listingController.updateRoute))
    //Delete Route assync
    .delete(
        isLoggedIn,
        isOwner,
        wrapAsync(listingController.deleteRoute));


module.exports = router;
