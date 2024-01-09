// Importing required modues and dependencies
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/server.config.js';
import UserModel from '../models/user.js';



// Check the token and verify it
export const jwtAUth = async (req, res, next) => {
    const token = req.cookies.token;
    if(!token){
        return res.redirect('/signin');
    }

    try {
        // Add Payload to the request body
        const payload = jwt.verify(token, JWT_SECRET);
        // console.log(payload);
        const user = await UserModel.findById(payload.user._id);
        if(!user){
            // Error page
        }
        req.user = user;
        next();
    } catch (error) {
        return res.redirect('/signin');
    }
}