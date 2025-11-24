const User = require("../models/user.js");

module.exports.RenderSignupForm = (req,res)=>{
    res.render("users/signup.ejs");
};


module.exports.UserSignUp = async (req, res , next) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ email, username });
        const registerUser = await User.register(newUser, password);

        req.login(registerUser, (err) => {
            if(err) return next(err);
            
            req.flash("success", `${username} Welcome to Wonderlust!`);
            return res.redirect("/listings");
        });

    } catch (err) {             
        req.flash("error", err.message);
        return res.redirect("/users/signup");
    }
};



module.exports.LoginPageForm = (req,res)=>{
    res.render("users/login.ejs");
};

module.exports.LoginCheck = async(req,res)=>{
    let {username} = req.body;
        req.flash("success",`${username} Welcome back to the Wonderlust You are logged in !`);
        if(!res.locals.redirectUrl){
            return res.redirect("/listings");
        }
        res.redirect(res.locals.redirectUrl);
};

module.exports.Logout = (req,res,next)=>{
    req.logOut((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","you are logged out!");
        res.redirect("/listings");
    })

};