// Importing required modules and dependencies
import passport from "passport";
// const GoogleStrategy = require('passport-google-oauth20').Strategy;
import googleStrategy from 'passport-google-oauth20'

import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, REDIRECT_URI } from "../config/server.config.js";
import UserModel from "../models/user.js";
import { generateRandomPassword } from "../repository/user.repository.js";

// Create new google strategy
const GoogleStrategy = googleStrategy.Strategy
passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: REDIRECT_URI
}, async (accessToken, refreshToken, profile, done) => {
    try {
        // Check for user
        const user = await UserModel.findOne({email: profile.emails[0].value});
        if(user){
           return done(null, user);
        }
        // If user is not present create new user
        if(!user){
            const newUser = await UserModel.create({
                name: profile.displayName,
                email: profile.emails[0].value,
                password: generateRandomPassword()
            });
            if(newUser){
                return done(null, newUser);
            }
        }
    } catch (error) {
        console.log(error);
    }
}));

passport.serializeUser((user, done) => {
    return done(null, user)
})

passport.deserializeUser((obj, done) => {
    done(null, obj);
});