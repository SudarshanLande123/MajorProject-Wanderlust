const Listing = require("../models/listing.js");
const geocodeLocation = require("../utils/geocode");

// INDEX
module.exports.Index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
};

// NEW FORM
module.exports.RenderNewForm = (req, res) => {
    res.render("listings/new.ejs");
};

// CREATE LISTING
module.exports.CreateListing = async (req, res, next) => {
    try {
        const newList = new Listing(req.body.listing);
        newList.owner = req.user._id;

        // Image
        if (req.file) {
            newList.image = {
                url: req.file.path,
                filename: req.file.filename
            };
        }

        // ✅ Geocoding (FIXED)
        const { lat, lon } = await geocodeLocation(req.body.listing.location);
        newList.latitude = lat;
        newList.longitude = lon;

        await newList.save();

        req.flash("success", "New Listing Created!");
        res.redirect(`/listings/${newList._id}`);

    } catch (err) {
        console.error("Create listing error:", err.message);
        req.flash("error", err.message);
        res.redirect("/listings/new");
    }
};

// SHOW LISTING
module.exports.ShowListing = async (req, res) => {
    const { id } = req.params;

    const listing = await Listing.findById(id)
        .populate({
            path: "reviews",
            populate: { path: "author" }
        })
        .populate("owner");

    if (!listing) {
        req.flash("error", "Listing not found!");
        return res.redirect("/listings");
    }

    res.render("listings/show.ejs", {
        listing,
        maptilerKey: process.env.MAPTILER_API_KEY
    });
};

// EDIT FORM
module.exports.EditListing = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);

    if (!listing) {
        req.flash("error", "Listing not found!");
        return res.redirect("/listings");
    }

    const originalImageURL = listing.image.url;
    const smallURL = originalImageURL.replace("/upload/", "/upload/w_250,c_fit/");

    res.render("listings/edit.ejs", { listing, smallURL });
};

// UPDATE LISTING
module.exports.UpdateListing = async (req, res) => {
    try {
        const { id } = req.params;

        const listing = await Listing.findById(id);
        if (!listing) {
            req.flash("error", "Listing not found!");
            return res.redirect("/listings");
        }

        Object.assign(listing, req.body.listing);

        // Update image
        if (req.file) {
            listing.image = {
                url: req.file.path,
                filename: req.file.filename
            };
        }

        // Update location
        if (req.body.listing.location) {
            const { lat, lon } = await geocodeLocation(req.body.listing.location);
            listing.latitude = lat;
            listing.longitude = lon;
        }

        await listing.save();

        req.flash("success", "Listing Updated Successfully!");
        res.redirect(`/listings/${id}`);

    } catch (err) {
        console.error("Update error:", err.message);
        req.flash("error", err.message);
        res.redirect("/listings");
    }
};

// DELETE
module.exports.DeleteListing = async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing deleted successfully");
    res.redirect("/listings");
};

// SEARCH
module.exports.SearchListing = async (req, res) => {
    const q = req.query.q;
    if (!q) return res.json([]);

    const listings = await Listing.find({
        title: { $regex: q, $options: "i" }
    }).limit(5);

    res.json(listings);
};
