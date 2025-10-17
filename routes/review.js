const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { reviewSchema } = require("../schema.js");
const Review = require("../models/review.js");
const  Listing = require("../models/listing.js");


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

// post review route
router.post(
    "/", 
    validateReview, 
    wrapAsync(async (req, res) => {
    let listing = await Listing.findById(req.params.id);//why we need to find the listing here
    let newReview = new Review(req.body.review);//what is happening in this line

    listing.reviews.push(newReview);//what is happening in this line

    await newReview.save();//why using .save here
    await listing.save();//why using .save here
    req.flash("success", "Successfully added a review!");
    // Redirect to the listing page after adding the review
    res.redirect(`/listings/${listing._id}`);
})
);

// delete review route
router.delete(
    "/:reviewId",
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