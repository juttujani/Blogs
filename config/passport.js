const User = require("../models/User");
const bcrypt = require("bcryptjs");
const LocalStrategy = require("passport-local").Strategy;

module.exports = function(passport){
    passport.use(new LocalStrategy({usernameField:'email',},async(email,password,done)=>{
        try{

            const user = await User.findOne({email});
            if(!user){
                return done(null,false,{
                    message: "User not found with that email"
                });
            }
            const isMatch = await bcrypt.compare(password,user.password);
            if(!isMatch){
                return done(null,false,{
                    message:"incorrect password"
                })
            }
            return done(null,user);
        }catch(error){
            return done(error)
        }
    }));

    passport.serializeUser(function(user,done){
        done(null,user.id)
    });
    passport.deserializeUser(async function(id,done){
        try{
            const user = await User.findById(id);
            done(null,user)
        }catch(error){
            done(error);
        }
    })
}