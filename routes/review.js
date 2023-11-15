const express = require('express');
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { reviewSchema} = require("../schema.js");
const Review = require('../models/review.js');
const Listing = require('../models/listing.js');
const reviewController = require("../controllers/review.js")
const {isLoggedIn, isOwner, validateListing,isReviewAuthor} =  require('../middleware.js');


const validateReview = (req, res, next)=>{
  let { error } = reviewSchema.validate(req.body);
  if(error){
    let errMsg = error.details.map((el)=> el.message).join(",");
    throw new ExpressError(400, errMsg);
  }else {
    next();
}};



// router.post("/",()=>{
//   console.log("request received")
// })



// Review route to save review in db
router.post("/" ,
isLoggedIn,  validateReview ,wrapAsync( reviewController.createReview ));


//   //delete review route


router.delete("/:reviewId", isLoggedIn,isReviewAuthor, reviewController.deletereview);




// router.delete("/:reviewId:",
// wrapAsync (  async(req, res)=>{
//   console.log("request-receied t ddel review")
//   let {id, reviewId} = req.params;
//   await Listing.findByIdAndUpdate(id,{$pull:{review: reviewId}});
//   await Review.findByIdAndDelete(reviewId);
//   res.redirect(`/listing/${id}`)

// }))
// ;

module.exports = router;