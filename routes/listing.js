const express = require('express');
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {listingSchema } = require("../schema.js");
const Review = require('../models/review.js');
const Listing = require('../models/listing.js');
const {isLoggedIn, isOwner, validateListing} =  require('../middleware.js');
const listingControler = require("../controllers/listing.js");
const multer  = require('multer')
const { storage } = require("../cloudConfig.js")
const upload = multer({ storage })




router
  .route("/")
  .get( wrapAsync(listingControler.index))
  .post(
   isLoggedIn, 
  //  validateListing,
   upload.single('listing[image]'),
   wrapAsync(listingControler.createNewListing));
 

// create new listing
router.get("/new", isLoggedIn,listingControler.renderNewForm );

router
  .route("/:id")
  .get( wrapAsync(listingControler.showListing))
  .put(isLoggedIn,
    isOwner,
    upload.single('listing[image]'),
    validateListing, 
    wrapAsync( listingControler.updateListing)
    )
    .delete(isLoggedIn, isOwner, wrapAsync(listingControler.deleteListing)
    );

  


//edit route
router.get("/:id/edit",
isLoggedIn,
isOwner,   
wrapAsync( listingControler.editListing)
  );


module.exports = router;
  