const user = require('../models/user.js');

module.exports.renderSignupForm = (req,res)=>{
        res.render("users/signup.ejs");
};

module.exports.signUp = async(req,res,next)=>{
     try{   
     let {username,email,password} = req.body;
     let newUser = new user({username,email});
     let registeredUser = await user.register(newUser,password);

     req.login(registeredUser,(err)=>{
        if (err) { 
                return next(err);
         }
         
        req.flash("success", "Welcome to WanderLust!");
        res.redirect("/listing")
     });

     }catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
     }
};

module.exports.renderLoginForm = (req,res)=>{
        res.render("users/login.ejs");
};

module.exports.loggedIn = async(req,res)=>{
        req.flash('success','Welcome to WanderLust,you are login!');
        let redirectUrl = res.locals.redirectUrl || "/listing";
        res.redirect(redirectUrl);
};

module.exports.logout = (req,res,next)=>{
        req.logOut((err)=>{
                if(err){
                 return next();
                }

                req.flash("success","you are logged out !");
                res.redirect("/listing");
        });
};