const bcrypt = require("bcryptjs")
const asynchandler = require("express-async-handler");
const User = require("../models/User");
const passport = require("passport");

exports.getLoginForm = asynchandler((req,res)=>{
    console.log(req.user);
    
    res.render("login",{
        title:"Login",
        error:"",
        user:req.user,
    })
})

exports.login = asynchandler(async(req,res,next)=>{
    passport.authenticate(
     "local",(err,user,info)=>{
         if(err){
             return next(err);
         }
         if(!user){
             return res.render("login",{
                 title:"Login",
                 user:req.user,
                 error:info.message
             });
         }
         req.logIn(user,(err)=>{
             if(err){
                 return next(err);
             }
             return res.redirect("/user/profile");
         })
         
     }
    )(req,res,next)
    
 })

exports.getRegister = asynchandler((req, res) => {
    res.render("register",{
        title:"Register",
        user:req.user,
        error:"",
    }); 
})
  
  exports.register = asynchandler(async (req, res) => {
    const { username, email, password } = req.body;
    console.log(req.body);
    
    try {
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.render("register", {
                title: "Register",
                user: req.user,
                error: "User already exists", 
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        
        const user = new User({
            username,
            email,
            password: hashedPassword,
        });
        
        await user.save();  
        
        res.redirect("/auth/login");

    } catch (error) {
        console.error("Registration Error: ", error);
        
        res.render("register", {
            title: "Register",
            user: req.user, 
            error: error.message, // Pass the error message here
        });
    }
})

exports.logout = asynchandler((req, res) => {
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        res.redirect("/auth/login");
    });
})