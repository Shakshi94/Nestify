const listing = require('../models/listings.js');
const review = require("../models/reviews.js");

module.exports.createReview = async(req, res) => {
    let listing_id = await listing.findById(req.params.id);
    let newReview = new review(req.body.review);
    newReview.author = req.user._id;
    listing_id.reviews.push(newReview);
    await newReview.save();
    await listing_id.save();
    req.flash("success", "New Review Created !");
    res.redirect(`/listing/${listing_id._id}`);
}

module.exports.deleteReview = async(req, res) => {
    let { id, reviewId } = req.params;
    await listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
    await review.findByIdAndDelete(reviewId);
    req.flash("success", "Review Deleted !");
    res.redirect(`/listing/${id}`);
};