const passport = require("passport")
const GoogleStrategy = require("passport-google-oauth20")
const User = require("../models/user-model")
const LocalStrategy = require("passport-local");
const bcrypt = require("bcrypt");
const { use } = require("passport");


passport.serializeUser((user, done) => {
    done(null, user._id);
  });
  
  passport.deserializeUser((_id, done) => {
      User.findById({_id}).then(user => {
          done(null, user)
      })
  });

passport.use( new LocalStrategy((username, password, done) => {
    User.findOne({email: username}).then(async (user) => {
        if(!use){
            return done(null, false)
        }

        await bcrypt.compare(password, user.password, function(err, result) {
            if(err)
                return done(null, false)
            if(!result)
                return done(null, false)
            else 
                return done(null, user)
        })
    }).catch(err => {
        return done(null, false)
    })
}))

passport.use(new GoogleStrategy(
    {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/redirect",
}, (accessToken, refreshToken, profile, done) => {
    // passprt callback
    User.findOne({googleID: profile.id}).then((foundUser) => {
        if(foundUser){
            done(null, foundUser)
        } else {
            new User({
                name: profile.displayName,
                googleID: profile.id,
                thumbnail: profile.photos[0].value,
                email: profile.emails[0].value
            }).save().then((newUser) => {
                done(null, newUser)
            })
        }
    })
}))

