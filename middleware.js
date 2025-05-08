const Listing = require("./models/listing.js");
const Review= require("./models/review.js");
const {listingSchema, reviewSchema} = require("./schema.js");
const ExpressError = require("./utils/ExpressError.js");


module.exports.isLoggedIn =(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl= req.originalUrl;
        req.flash("error", "you must login to perform this task!")
        return res.redirect("/login");
    }
    next();
};

module.exports.saveRedirectUrl= (req,res, next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl= req.session.redirectUrl;
    }
    next();
};

module.exports.isOwner= async (req,res,next)=>{
    let {id} = req.params;
    // console.log(req.body.listing);
    let listing = await Listing.findById(id);
    if(!listing.owner.equals(res.locals.currUser._id)){
        req.flash("error", "you don't have the permission for this task!");
        return res.redirect(`/listings/${id}`);
    }
    next();
};

module.exports.validateListing = (req,res,next)=>{
    // console.log("validate listing"); debugline
    //console.log(req.body); another debug line 
    // if(!req.body || !req.body.listing){
    //     throw new ExpressError(400, "send a valid data for listing");
    // }
    let {error} = listingSchema.validate(req.body);
    // console.log(error);
    if(error){
        let errMsg= error.details.map((el)=> el.message).join(",");
        throw new ExpressError(400, errMsg);
    }else{
        next();
    }
};

module.exports.validateReview = (req,res,next)=>{
    let {error} = reviewSchema.validate(req.body);
    if(error){
        let errMsg= error.details.map((el)=> el.message).join(",");
        throw new ExpressError(400, errMsg);
    }else{
        next();
    }
};

module.exports.isReviewAuthor= async (req,res,next)=>{
    let {id,reviewId} = req.params;
    // console.log(req.body.listing);
    let review = await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error", "you can't delete others Review!");
        return res.redirect(`/listings/${id}`);
    }
    next();
};