const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, validateReview, isReviewAuthor } = require("../middleware.js");


// post review route
router.post(
    "/",
    isLoggedIn,
    validateReview,
    wrapAsync(async (req, res) => {
        let listing = await Listing.findById(req.params.id);
        let newReview = new Review(req.body.review);
        newReview.author = req.user._id;
        // push id to avoid embedding full doc
        listing.reviews.push(newReview._id);

        await newReview.save();
        await listing.save();
        req.flash("success", "Successfully added a review!");
        // Redirect to the listing page after adding the review
        res.redirect(`/listings/${listing._id}`);
    })
);

// delete review route
router.delete(
    "/:reviewId",
    isLoggedIn,
    isReviewAuthor,
    wrapAsync(async (req, res) => {
        let { id, reviewId } = req.params;
        // console.log(id, reviewId);
        // Find the listing by ID
        let listing = await Listing.findById(id);

        // Remove the review from the listing
        listing.reviews.pull(reviewId);

        // this is to remove the saved id of review in the listing schema this also works same as above line
        // await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });


        // Delete the review from the database
        await Review.findByIdAndDelete(reviewId);

        // Save the updated listing
        await listing.save();

        // console.log("Review Deleted");
        req.flash("success", "Successfully deleted a review!");
        // Redirect to the listing page after deleting the review
        res.redirect(`/listings/${listing._id}`);
    })
);


module.exports = router;