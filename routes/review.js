const express = require('express');
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utlis/wrapAsyn.js");
const {validateReview,isLoggedIn,isReviewAuthor} = require('../middleware.js');
const reviewController = require('../controllers/review.js');

router.route('/')
      .post(isLoggedIn,validateReview, wrapAsync(reviewController.createReview));

router.route('/:reviewId')
      .delete(isLoggedIn,isReviewAuthor,wrapAsync(reviewController.deleteReview));

module.exports = router;