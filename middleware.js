const Listing = require("./models/listing.js");
const { listingSchema } = require("./Schema.js");
const ExpressError = require("./utils/ExpressError.js");
const {reviewSchema } = require("./Schema.js");
const Review = require("./models/review.js");

module.exports.isLoggedIn = (req,res,next)=>{
    if(! req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error","You must be logged in!");
        return res.redirect("/users/login");    
    }
    next();
}

module.exports.saveRedirectUrl = (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner = async (req,res,next)=>{
    let {id} = req.params;

    const listing = await Listing.findById(id);
    if(! listing.owner[0]._id.equals(res.locals.currUser._id)){
        req.flash("error",("You don't have permission to Edit"));
        return res.redirect(`/listings/${id}`);
    }   
    next();
}


//it will check the data from req.body i.e new listing data before adding data into the DB and also checking the constraint of DB

module.exports.validateListing = (req,res,next)=>{ 
    let {error} = listingSchema.validate(req.body.listing);
    if(error)
    {
        let errMsg = error.details.map((el)=> el.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }

}


// It will chech the review if review is send through hopscocth then it will take it without some fields so joi is used for that
module.exports.validateReview = (req,res,next)=>{
    let {error} = reviewSchema.validate(req.body);
    if(error)
    {
        let errMsg = error.details.map((el)=> el.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }

}


module.exports.isReviewAuthor = async (req,res,next)=>{
    let {id,reviewId} = req.params;

    const review = await Review.findById(reviewId);
    if(! review.author.equals(res.locals.currUser._id)){
        req.flash("error",("You are not author of Review"));
        return res.redirect(`/listings/${id}`);
    }   
   next();
}

