const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js");
const {validateReview, isLoggedIn,isReviewAuthor} = require("../middleware.js");
const { CreateReview, DestroyReview } = require("../controllers/reviews.js");


//to push review
router.post("/",isLoggedIn,validateReview ,wrapAsync(CreateReview));

//delete review route

router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(DestroyReview));

module.exports = router;