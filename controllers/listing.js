const Listing = require("../models/listing.js");
const { getCoordinates } = require("../utils/geoCode.js");

module.exports.index = async (req,res)=>{
    const allListings= await Listing.find({});
    res.render("listings/index.ejs", {allListings});
};

module.exports.renderNewForm = (req,res)=>{
    // console.log(req.user);
    res.render("listings/new.ejs");
};

module.exports.showListing = async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id)
        .populate({
            path: "reviews", 
            populate: { path: "author"},
        }).populate("owner");
    if(!listing){
        req.flash("error", "Listing does not exist!");
        return res.redirect("/listings");
    }
    res.render("listings/show.ejs", {listing});
};

module.exports.createListing =async (req,res)=>{
    //let {title, description, image, price, location, country}= req.body;
    // if(!req.body.listing){
    //     throw new ExpressError(400, "send a valid data for listing");
    // }
    let url = req.file.path;
    let filename = req.file.filename;
    // console.log(url, "..", filename);
    const { location } = req.body.listing;
    const geometry = await getCoordinates(location);
    const newListing = new Listing(req.body.listing);
    newListing.geometry = geometry;
    newListing.owner = req.user._id;
    newListing.image = {url ,filename};
    // console.log(req.user);
    await newListing.save();
    req.flash("success", "New listing Created");
    res.redirect("/listings");
};

module.exports.renderEditForm = async(req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error", "Listing does not exist!");
        return res.redirect("/listings");
    }
    let originalImage = listing.image.url;
    // console.log(originalImage);
    originalImage= originalImage.replace("/upload","/upload/w_250");
    res.render("listings/edit.ejs", {listing, originalImage});
};

module.exports.updateListing = async (req,res)=>{
    let {id} = req.params;


    const { location } = req.body.listing;
    const geometry = await getCoordinates(location);

    let listing =await Listing.findByIdAndUpdate(id, {...req.body.listing});
    console.log(req.file);
    if(typeof req.file !== "undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = {url ,filename};
    }
    listing.geometry= geometry;
    await listing.save();
    req.flash("success", "Listing Updated");
    res.redirect(`/listings/${id}`);
};

module.exports.deleteListing = async (req,res)=>{
    let {id} = req.params;
    let deletedListing= await Listing.findByIdAndDelete(id);
    // console.log(deletedListing);
    req.flash("success", "Listing Deleted");
    res.redirect("/listings");
};

