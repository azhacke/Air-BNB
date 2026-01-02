const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
// const { index, showRoute, createRoute,editRoute, updateRoute, deleteRoute } = require("../controllers/listings.js");
const listingController = require("../controllers/listings.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });


router.route("/")
    //index route assync
    .get(wrapAsync(listingController.index))
    //Create Route
    .post(
        isLoggedIn,
        // validateListing,
        upload.single('listing[image][file]'),
        wrapAsync(listingController.createRoute)
    );
// .post(upload.single('listing[image][file]'), (req, res, next) => {
//     res.send(req.file);
// });

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
        isOwner,
        upload.single('listing[image][file]'),
        validateListing,
        wrapAsync(listingController.updateRoute))
    //Delete Route assync
    .delete(
        isLoggedIn,
        isOwner,
        wrapAsync(listingController.deleteRoute));


module.exports = router;
