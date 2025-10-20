const Listing = require("./models/listing");
const ExpressError = require("./utils/ExpressError.js");
// combine imports from schema
const { listingSchema, reviewSchema } = require("./schema.js");
// changed from `const review = require("./models/review.js");`
const Review = require("./models/review.js");

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        //redirect to login if not authenticated
        req.flash("error", "You must be logged in to create a listing.");
        return res.redirect("/login");
    }
    next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
        // delete req.session.redirectUrl;
    }
    next();// proceed to the next middleware or route handler
};

module.exports.isOwner = async (req, res, next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if (!listing.owner.equals(res.locals.currentUser._id)) {
        req.flash("error", "You do not have permission to do that!");
        return res.redirect(`/listings/${id}`);
    }
    next();
};

// validate listing middleware
module.exports.validateListing = (req, res, next) => {//why do we need this when we have schema validation in model
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
module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map(el => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next(); //what does next do here?
        //next is a function in the Express router which, when invoked, executes the middleware succeeding the current middleware
    }
};

module.exports.isReviewAuthor = async (req, res, next) => {
    let { id, reviewId } = req.params;
    const rev = await Review.findById(reviewId);
    if (!rev) {
        req.flash("error", "Review not found");
        return res.redirect(`/listings/${id}`);
    }
    if (!rev.author.equals(res.locals.currentUser._id)) {
        req.flash("error", "You are not the author");
        return res.redirect(`/listings/${id}`);
    }
    next();
};