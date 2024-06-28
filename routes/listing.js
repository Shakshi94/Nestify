const express = require('express');
const router = express.Router();
const wrapAsync = require("../utlis/wrapAsyn.js");
const { isLoggedIn, isOwner,validateListing} = require('../middleware.js')
const listingController = require('../controllers/listing.js');
const multer  = require('multer');
const {storage} = require('../cloudConfig.js');
const upload = multer({storage });

const Listing = require("../models/listings.js");

router.route("/")
  .get(wrapAsync(listingController.index))
  .post(isLoggedIn,upload.single('listing[image]'),validateListing,wrapAsync(listingController.createListing));
 
router.get('/search',listingController.search);

router.get('/category/:name',listingController.category)

// new route 

router.get('/new',isLoggedIn,listingController.renderCreateForm);

router.route('/:id')
      .get(wrapAsync(listingController.show))
      .put(isLoggedIn,isOwner,upload.single('listing[image]'),validateListing, wrapAsync(listingController.updatelisting))
      .delete(isLoggedIn,isOwner,wrapAsync(listingController.deleteListing))

// Edit route 
router.get('/:id/edit',isLoggedIn,isOwner,wrapAsync(listingController.renderEditForm));

module.exports = router;