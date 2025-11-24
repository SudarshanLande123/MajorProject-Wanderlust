const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const Review = require("./review.js");
const listingSchema = new Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        maxLength:200,
        required:true
    },
    image:{
        filename:{
            type:String,
        },
        url:{
            type:String,
            default:"https://wallpaperaccess.com/full/81552.jpg",
            set: v => v === "" ? "https://wallpaperaccess.com/full/81552.jpg" : v,
        }
    },
    price:{
        type:Number,
        min:100,
        required:[true,"price is required"]
    },
    location:{
        type:String,
        required:true
    },
    country:{
        type:String,
        required:true
    },
    latitude:Number,
    longitude:Number,
    reviews:[
        {
        type:Schema.Types.ObjectId,
        ref:"Review",
        }
    ],
    owner:[
        {
        type:Schema.Types.ObjectId,
        ref:"User",
        }

    ],
});

listingSchema.post("findOneAndDelete",async(listing) =>{
    if(listing)
    {
    await Review.deleteMany({_id: {$in: listing.reviews}})
    }
});


//create the Model

const Listing = mongoose.model("Listing",listingSchema);

module.exports = Listing;
