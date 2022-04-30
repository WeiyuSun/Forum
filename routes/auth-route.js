const router = require("express").Router();
const passport = require("passport");
const UserInfoError = require("passport-google-oauth20/lib/errors/userinfoerror");
const User = require("../models/user-model")
const bcrypt = require("bcrypt");
const e = require("connect-flash");

router.get("/login", (req,res) => {
    res.render("login", {user: req.user})
})

router.get("/logout", (req, res) => {
    req.logOut()
    res.redirect("/")
})

router.get("/signup", (req, res) => {
    res.render("signup", {user: req.user})
})

router.post("/signup",async (req, res) => {
    let {name, email, password} = req.body

    // check if the data is aleady in database
    const emailExist = await User.findOne({email})
    //const userNameExist = await User.findOne({name})

    if(emailExist){
        req.flash("error_msg", "Email has already been registered")
        res.redirect("/auth/signup")
        return
    }

    // if(userNameExist){
    //     req.flash("error_msg", "user name has been used")
    //     res.redirect("/auth/signup")
    // }

    const hash = await bcrypt.hash(password, 10)
    password = hash
    let newUser = new User({name, email, password})

    try{
        await newUser.save();
        req.flash("success_msg", "Registration succeeds")
        res.redirect("/auth/login")
    }catch(err) {
        req.flash("error_msg", err.errors.name.properties.message)
        res.redirect("/auth/signup")
    }
})

router.post("/login", passport.authenticate("local", {
    failureRedirect: "/auth/login",
    failureFlash: "Email or password does not correct"
}), (req, res) => {
    if(req.session.returnTo){
        let newPath = req.session.returnTo
        req.session.returnTo = ""
        res.redirect(newPath)
    }else {
        res.redirect("/profile")
    }
})

router.get(
    "/google",
    passport.authenticate("google", {
      scope: ["profile", "email"],
      prompt: "select_account",
    })
  );

router.get("/google", passport.authenticate("google", {
    scope: ["profile", "email"],
}))

router.get("/google/redirect", passport.authenticate("google"), (req, res) => {
    if(req.session.returnTo){
        let newPath = req.session.returnTo
        req.session.returnTo = ""
        res.redirect(newPath)
    }else {
        res.redirect("/profile")
    }
})

module.exports = router