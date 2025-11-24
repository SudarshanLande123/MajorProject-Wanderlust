const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const {saveRedirectUrl} = require("../middleware.js");
const { UserSignUp, LoginPageForm, RenderSignupForm, LoginCheck, Logout } = require("../controllers/users.js");

router.get("/signup",(RenderSignupForm));

router.post("/signup", wrapAsync (UserSignUp));

router.get("/login",(LoginPageForm));

//to check the login password to the signup password passport have its midlleware to check as below passport.authenticate if login is not successfull then it will executes the ,passport.authenticate()

router.post("/login",saveRedirectUrl,passport.authenticate("local",{
    failureRedirect: "/users/login",
    failureFlash:true
    }) , LoginCheck
);

router.get("/logout",Logout);

module.exports = router;