import express from 'express';
import { getForgotPassword, getHome, 
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


const userRoutes = express.Router();

userRoutes.get('/', getSignUp);
userRoutes.post('/signup', postSignUp);
userRoutes.get('/signin', getSignIn);
userRoutes.get('/home',jwtAUth, getHome);
userRoutes.get('/logout', jwtAUth, getLogOut);
userRoutes.get('/reset-password', jwtAUth, getResetPassword);
userRoutes.post('/reset-password', jwtAUth, postResetPassword)
userRoutes.get('/forgot-password', getForgotPassword);
userRoutes.post('/forgot-password', postForgotPassword);
userRoutes.get('/auth/google', passport.authenticate('google', {scope: ['profile', 'email']}));
userRoutes.get('/user/auth/google/callback', passport.authenticate('google', {failureRedirect: '/'}), googleSignIn);
userRoutes.post('/signin', postSignIn);

export default userRoutes;