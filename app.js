if(process.env.NODE_ENV != "production"){
    require("dotenv").config();
}
// console.log(process.env.SECRET);

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
app.use(methodOverride("_method"));
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const listeningRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js"); 
const dbURL = process.env.ATLASDB_URL;
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
// const { error } = require("console");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({extended:true}));
app.engine("ejs",ejsMate);


main().then(()=>{
    console.log("connection Successfull");
}).catch((err)=>{
    console.log("error occurs",err);
});

async function main(){
    await mongoose.connect(dbURL);
};


const store = MongoStore.create({
    mongoUrl: dbURL,
    collectionName: "sessions",
    touchAfter: 24 * 3600, // 24 hours
});


store.on("error",(err)=>{
    console.log("Error in Mongo Session Store",err);
});

const sessionOption = {
    store,
    secret: process.env.SECRET,
    resave:false ,
    saveUninitialized:true,
    cookie:{
        expires: Date.now() + 7 *24 * 60 * 60 * 1000 ,
        maxAge: 7 *24 * 60 * 60 * 1000,
        httpOnly:true,
    }
};




app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());    
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});


// app.get("/demouser",async(req,res)=>{
//     let fakeUser = new User ({
//         email:"abc@gmail.com",
//         username:"abc"
//     });

//     let registerUser = await User.register(fakeUser,"pass@123");
//     res.send(registerUser);
// });

app.use("/listings",listeningRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/users",userRouter);



// 404 handler — catches all requests that didn't match any route
app.use((req, res, next) => {
    next(new ExpressError(404, "Page Not Found!"));
});

// Global error-handling middleware — handles errors from anywhere in the app
app.use((err, req, res, next) => {
    if (res.headersSent) {
        return next(err); // If a response was already sent, delegate to default Express error handler
    }
    let { statusCode = 500, message = "Something Went Wrong" } = err;
    res.status(statusCode).render("listings/error.ejs", { message });
});

// Server starts listening on port 3000
app.listen(3000, () => {
    console.log("Server is listening on port 3000");
});
