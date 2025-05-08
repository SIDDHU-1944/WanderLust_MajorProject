const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const {isLoggedIn, isOwner, validateListing}= require("../middleware.js");
const listingcontroller = require("../controllers/listing.js");
const multer = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({storage});



router.route("/")
.get(wrapAsync(listingcontroller.index))//index Route
.post(isLoggedIn, upload.single('listing[image]'), validateListing, wrapAsync(listingcontroller.createListing))//create route



//new route
router.get("/new",isLoggedIn, listingcontroller.renderNewForm);

router.route("/:id")
.get(wrapAsync(listingcontroller.showListing))//show route
.put(isLoggedIn, isOwner, upload.single('listing[image]'), validateListing, wrapAsync(listingcontroller.updateListing))//update route
.delete(isLoggedIn, isOwner, wrapAsync(listingcontroller.deleteListing))//delete route


//edit route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingcontroller.renderEditForm));

module.exports = router;