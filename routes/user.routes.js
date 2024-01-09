// Importing required modules and dependencies
import express from 'express';
import { getErrorPage, getForgotPassword, getHome, 
    getLogOut, 
    getResetPassword, 
    getSignIn, 
    getSignUp, 
    googleSignIn, 
    postForgotPassword, 
    postResetPassword, 
    postSignIn, 
    postSignUp } from '../controller/user.controller.js';
import { jwtAUth } from '../middleware/jwt.middleware.js';
import passport from 'passport';

// Express router
const userRoutes = express.Router();

// Get Signup page
userRoutes.get('/', getSignUp);
// Create new user
userRoutes.post('/signup', postSignUp);
// Get signin page
userRoutes.get('/signin', getSignIn);
// Get homepage #Secured
userRoutes.get('/home',jwtAUth, getHome);
// Get logout page #Secured
userRoutes.get('/logout', jwtAUth, getLogOut);
// Reset password for logged in user
userRoutes.get('/reset-password', jwtAUth, getResetPassword);
// Update password in database
userRoutes.post('/reset-password', jwtAUth, postResetPassword);
// Forgot password
userRoutes.get('/forgot-password', getForgotPassword);
// Get new password via email
userRoutes.post('/forgot-password', postForgotPassword);
// Google auth
userRoutes.get('/auth/google', passport.authenticate('google', {scope: ['profile', 'email']}));
userRoutes.get('/user/auth/google/callback', passport.authenticate('google', {failureRedirect: '/'}), googleSignIn);
userRoutes.post('/signin', postSignIn);
userRoutes.get('/error', getErrorPage);

// Exporting all routes
export default userRoutes;