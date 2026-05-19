const Listing = require("../models/listing.js");

module.exports.Index = async (req, res) => {
  let allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
};

module.exports.RenderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.CreateListing = async (req, res, next) => {
  try {
    let newList = new Listing(req.body.listing);
    newList.owner = req.user._id;

    // Image
    if (req.file) {
      newList.image = {
        url: req.file.path,
        filename: req.file.filename,
      };
    }
const query = req.body.listing.location;
const geoURL = `http://api.positionstack.com/v1/forward?access_key=${process.env.POSITIONSTACK_API_KEY}&query=${encodeURIComponent(query)}`;
const geoRes = await fetch(geoURL);
const geoData = await geoRes.json();

if (!geoData || !geoData.data || geoData.data.length === 0) {
    req.flash("error", "Location not found. Please enter a valid address.");
    return res.redirect("/listings/new");
}

newList.latitude = geoData.data[0].latitude;
newList.longitude = geoData.data[0].longitude;

    await newList.save();

    req.flash("success", "New Listing Created!");
    return res.redirect(`/listings/${newList._id}`);
  } catch (e) {
    console.error("Error creating listing:", e);
    return next(e);
  }
};

module.exports.ShowListing = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("owner");
  if (!listing) {
    req.flash("error", "Listing which you requested is not exist!");
    return res.redirect("/listings");
  }
  res.render("listings/show.ejs", {
    listing,
    maptilerKey: process.env.MAPTILER_API_KEY,
  });
};

module.exports.EditListing = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing which you requested is not exist!");
    return res.redirect("/listings");
  }

  let OriginalImageURL = listing.image.url;
  let smallURL = OriginalImageURL.replace("/upload/", "/upload/w_250,c_fit/");
  res.render("listings/edit.ejs", { listing, smallURL });
};

module.exports.UpdateListing = async (req, res, next) => {
  try {
    let { id } = req.params;

    let listing = await Listing.findByIdAndUpdate(
      id,
      { ...req.body.listing },
      { new: true },
    );

    if (!listing) {
      req.flash("error", "Listing not found.");
      return res.redirect("/listings");
    }

    // Update image if new one uploaded
    if (req.file) {
      listing.image = {
        url: req.file.path,
        filename: req.file.filename,
      };
    }

    // Update location → geocode
    if (
      req.body.listing.location &&
      req.body.listing.location !== listing.location
    ) {
      const query = req.body.listing.location;
      const geoURL = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`;

      const geoRes = await fetch(geoURL, {
        headers: {
          "User-Agent": "WanderlustApp/1.0 (landesudarshan51@gmail.com)", // ✅ FIX 2: was missing User-Agent
        },
      });

      const contentType = geoRes.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
    req.flash("error", "Location service unavailable. Please try again.");
    return res.redirect("/listings/new");
}
      const geoData = await geoRes.json();

      if (geoData.length > 0) {
        listing.latitude = parseFloat(geoData[0].lat);
        listing.longitude = parseFloat(geoData[0].lon);
      }
    }

    await listing.save();

    req.flash("success", "Listing Updated Successfully!");
    return res.redirect(`/listings/${id}`);
  } catch (e) {
    console.error("Error updating listing:", e);
    return next(e);
  }
};

module.exports.DeleteListing = async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing is Deleted Successfully");
  res.redirect("/listings");
};

module.exports.SearchListing = async (req, res) => {
  let q = req.query.q;

  if (!q) return res.json([]);

  const listings = await Listing.find(
    { title: { $regex: q, $options: "i" } },
  ).limit(5);

  res.json(listings);
};
