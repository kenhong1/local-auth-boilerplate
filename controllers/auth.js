const express = require('express');
const router = express.Router();
const db = require("../models")
const passport = require("../config/passportConfig");

router.get('/signup', function(req, res) {
  res.render('auth/signup');
});

router.post("/signup", function(req, res) {
  db.user.findOrCreate({
    where: {email: req.body.email},
    defaults: {
      name:req.body.name,
      password: req.body.password
    }
  }).spread(function(user, created){
    console.log("inside signup, usercreated", created); 
    if(created) {
      console.log("user created");
      passport.authenticate("local", {
        successRedirect: "/", 
        successFlash: "Account Created and Logged In"
      })(req, res); 
    } else {
      console.log("email already exists")
      // res.flash("error", "email arleady ecists")
      res.redirect("/auth/signup"); 
    }
  }).catch(function(error){
    res.redirect("/auth/signup"); 
  })
});

router.get('/login', function(req, res) {
  res.render('auth/login');
});

router.post("/login", passport.authenticate("local",{
  successRedirect:"/",
  successFlash: "You have logged in!",
  failureRedirect: "/auth/login",
  failureFlash: "invalid username and/or passwod"
}));

router.get("/logout", function(req, res){
  req.logout(); 
  req.flash("success", "YOU HAVE LOGGED OUT!"); 
  res.redirect("/");
});

module.exports = router;