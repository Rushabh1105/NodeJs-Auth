// Importing required modules
import { constants } from "crypto";
import { comparePassword, 
    createToken, 
    createUser, 
    findUserByEmail, 
    generateRandomPassword, 
    updatePassword } from "../repository/user.repository.js";
import { passwordChangeMail, sendPasswordMail, sendSignInAlert, sendWelcomeMail } from "../utils/mail.helper.js";


// Function for signup using email and password
export const getSignUp = async (req, res) => {
    try {
        // Get signup page
        return res.render('signup', {
            success: true,
            error: null,
        })
    } catch (error) {
        return res.render('error')
    }
}

// Create new user to database with validations
export const postSignUp = async (req, res) => {
    try {
        console.log(req.body);
        const { name, email, password, confirmPassword} = req.body; 
        // Check for both passwords
        if(password != confirmPassword){
            return res.render('signup', {
                success: false,
                error: 'Password and Confirm password shuld be same',
            })
        }
        // Check if user is already present
        const user = await findUserByEmail(email);
        if(user !== null){
            return res.render('signup', {
                success: false,
                error: 'user alredy exist',
            })
        }
        // Create new user
        await createUser(name, email, password);
        // Send welcome email
        sendWelcomeMail(email);
        return res.redirect('/signin')
    } catch (error) {
        // Display error message
        console.log(error)
        return res.render('signup', {
            success: false,
            error: 'Something went wrong',
        })
    }
}

// Get signin page
export const getSignIn = async (req, res) => {
    try {
        return res.render('signin', {
            success: true,
            error: null
        })
    } catch (error) {
        return res.render('signin', {
            success: false,
            error: 'Something went wrong'
        })
    }
}

// Verify user for signin
export const postSignIn = async (req, res) => {
    try {
        console.log(req.body);
        const {email, password} = req.body;
        // Check for user
        const user = await findUserByEmail(email);
        if(user == null){
            return res.render('signin', {
                success: false,
                error: 'User not found please sign up'
            })
        }
        // Check password
        const checkPassword = await comparePassword(user, password);
        if(!checkPassword){
            return res.render('signin', {
                success: false,
                error: 'Sorry wrong password'
            })
        }
        // Send JWT token in cookies
        const token = await createToken(user);
        res.cookie('token', token, {
            httpOnly: true,
            expiresIn: '1d'
        })
        // Send signin alert email
        sendSignInAlert(email);
        return res.redirect('/home')
        
    } catch (error) {
        return res.render('signin', {
            success: false,
            message: 'Something went wrong'
        })
    }
}

// get homepage
export const getHome = async(req, res) => {
    try {
        // console.log(req.cookies)
        return res.render('home');
    } catch (error) {
        return res.rdirect('/error')
    }
}

// logout functionality
export const getLogOut = async (req, res) => {
    try {
        // Clear jwt cookies
        res.clearCookie('token');
        return res.redirect('/signin')
    } catch (error) {
        return res.redirect('/error')
    }
}

// Reset password for logged in user
export const getResetPassword = async (req, res) => {
    try {
        return res.render('reset-password', {
            success: true,
            error: null
        })
    } catch (error) {
        return res.redirect('/error')
    }
}

// Update password 
export const postResetPassword = async (req, res) => {
    try {
        // console.log(req.body)
        const {current_password, new_password, confirm_password} = req.body;
        // check for both passwords
        if(new_password != confirm_password){
            return res.render('reset-password', {
                success: false,
                error: 'password and confirm password did not match'
            })
        }

        // Compare existing password 
        const checkPassword = await comparePassword(req.user, current_password);
        if(!checkPassword){
            return res.render('reset-password', {
                success: false,
                error: 'sorry wrong password'
            })
        }
        // Send alert about password change
        passwordChangeMail(req.user.email)
        // Update password in database
        await updatePassword(req.user, new_password);
        return res.redirect('/home')
    } catch (error) {
        console.log(error)
        return res.render('reset-password', {
            success: false,
            error: 'Something went wrong'
        })
    }
}

// Get forgot password page
export const getForgotPassword = async (req, res) => {
    try {
        
        return res.render('forgot-password')
    } catch (error) {
        return res.redirect('/error')
    }
}

// Setup new password
export const postForgotPassword = async (req, res) => {
    try {
        console.log(req.body);
        const {email} = req.body;
        // Check for user
        const user = await findUserByEmail(email);
        if(user){
            // Generate a random string password
            const password = generateRandomPassword();
            console.log(password);
            // Update user pasword
            await updatePassword(user, password);
            // Send password via email
            sendPasswordMail(email, password)
            return res.redirect('/signin')
        }
        res.render('forgot-password')
    } catch (error) {
        return res.redirect('/error')
    }
}

// Send token for google signin
export const googleSignIn = async(req, res) => {
    try {
        // console.log(req);
        const token = await createToken(req.user);
        res.cookie('token', token, {
            httpOnly: true,
            expiresIn: '1d'
        })
        sendSignInAlert(req.user.email);
        return res.redirect('/home')
    } catch (error) {
        console.log(error);
        return res.redirect('/signin')
    }
}

export const getErrorPage = async(req, res) => {
    try {
        res.render('error')
    } catch (error) {
        res.render('error')
    }
}