const express = require('express');
const wrapAsync = require('../utils/wrapAsync');
const passport = require('passport');
const user = require('../models/user.js');
const { saveRedirectUrl } = require('../middleware');
const router = express.Router();


module.exports.renderSignUpForm = (req, res)=>{
    res.render("./users/signup.ejs")
};

module.exports.userSignUp = async(req, res)=>{
    try{
     let {username, email, password} = req.body;
     const newUser = new user({email, username})
     const registeredUser = await user.register(newUser, password);
     console.log(registeredUser);
     req.login(registeredUser, (err)=>{
         if(err){
             return next(err);
         }
         req.flash("success","welcome to wonderlust");
         res.redirect("/listing");
     })
    }catch(e){
         req.flash("error", e.message);
         res.redirect("/signup")
     }
    
 };

 module.exports.renderLoginForm = (req, res)=>{
    res.render("./users/login.ejs")
};

module.exports.userLogout = (req, res)=>{
    req.logout((err)=>{
        if(err){
           return next(err);
        }
        req.flash("success", "you are logged out successfully");
        res.redirect("/listing")
    })
};

module.exports.login = async(req, res)=>{
    req.flash("success","welcome to wonderlust ");
    let redirectUrl = res.locals.redirectUrl || "/listing";
    res.redirect(redirectUrl)
};