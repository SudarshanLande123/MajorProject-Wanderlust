const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const {isLoggedIn, isOwner,validateListing,checkSearch} = require("../middleware.js");
const { authorize } = require("passport");
const { Index, RenderNewForm, ShowListing, CreateListing, EditListing, UpdateListing, DeleteListing, SearchListing } = require("../controllers/listings.js");
const multer  = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage });


// LIVE SEARCH AUTOCOMPLETE
router.get("/search",wrapAsync(SearchListing));

//Index Route

router.get("/",wrapAsync(Index));

//new Route
router.get("/new",isLoggedIn,RenderNewForm);

//create Route

router.post("/",isLoggedIn,upload.single('listing[image][url]'),wrapAsync(CreateListing));

// router.post("/",upload.single('listing[image][url]'),(req,res)=>{
//     res.send(req.file);
// });

//Show Route

router.get("/:id",wrapAsync(ShowListing));

//Edit Route
router.get("/:id/edit",isLoggedIn,wrapAsync(EditListing));

//update Route
router.put("/:id" ,isLoggedIn,isOwner,upload.single('listing[image][url]'),validateListing,wrapAsync(UpdateListing));

//delete route
router.delete("/:id",isLoggedIn,isOwner,wrapAsync(DeleteListing));



module.exports = router;