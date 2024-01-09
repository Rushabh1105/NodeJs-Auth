import { constants } from "crypto";
import { comparePassword, createToken, createUser, findUserByEmail, generateRandomPassword, updatePassword } from "../repository/user.repository.js";
import { passwordChangeMail, sendPasswordMail, sendSignInAlert, sendWelcomeMail } from "../utils/mail.helper.js";



export const getSignUp = async (req, res) => {
    try {
        res.render('signup', {
            success: true,
            error: null,
        })
    } catch (error) {
        res.render('signup')
    }
}

export const postSignUp = async (req, res) => {
    try {
        console.log(req.body);
        const { name, email, password, confirmPassword} = req.body; 
        if(password != confirmPassword){
            return res.render('signup', {
                success: false,
                error: 'Password and Confirm password shuld be same',
            })
        }
        const user = await findUserByEmail(email);
        if(user !== null){
            return res.render('signup', {
                success: false,
                error: 'user alredy exist',
            })
        }
        
        await createUser(name, email, password);
        sendWelcomeMail(email);
        return res.redirect('/signin')
    } catch (error) {
        console.log(error)
        res.render('signup', {
            success: false,
            error: 'Something went wrong',
        })
    }
}

export const getSignIn = async (req, res) => {
    try {
        res.render('signin', {
            success: true,
            error: null
        })
    } catch (error) {
        res.render('signin', {
            success: false,
            error: 'Something went wrong'
        })
    }
}

export const postSignIn = async (req, res) => {
    try {
        console.log(req.body);
        const {email, password} = req.body;

        const user = await findUserByEmail(email);
        if(user == null){
            return res.render('signin', {
                success: false,
                error: 'User not found please sign up'
            })
        }

        const checkPassword = await comparePassword(user, password);
        if(!checkPassword){
            return res.render('signin', {
                success: false,
                error: 'Sorry wrong password'
            })
        }

        const token = await createToken(user);
        res.cookie('token', token, {
            httpOnly: true,
            expiresIn: '1d'
        })
        sendSignInAlert(email);
        return res.redirect('/home')
        
    } catch (error) {
        res.render('signin', {
            success: false,
            message: 'Something went wrong'
        })
    }
}

export const getHome = async(req, res) => {
    try {
        // console.log(req.cookies)
        res.render('home');
    } catch (error) {
        
    }
}

export const getLogOut = async (req, res) => {
    try {
        res.clearCookie('token');
        res.redirect('/signin')
    } catch (error) {
        
    }
}

export const getResetPassword = async (req, res) => {
    try {
        res.render('reset-password', {
            success: true,
            error: null
        })
    } catch (error) {
        
    }
}

export const postResetPassword = async (req, res) => {
    try {
        // console.log(req.body)
        const {current_password, new_password, confirm_password} = req.body;
        // console.log(req.user)
        if(new_password != confirm_password){
            return res.render('reset-password', {
                success: false,
                error: 'password and confirm password did not match'
            })
        }

        const checkPassword = await comparePassword(req.user, current_password);
        if(!checkPassword){
            return res.render('reset-password', {
                success: false,
                error: 'sorry wrong password'
            })
        }
        passwordChangeMail(req.user.email)
        await updatePassword(req.user, new_password);
        res.redirect('/home')
    } catch (error) {
        console.log(error)
        res.render('reset-password', {
            success: false,
            error: 'Something went wrong'
        })
    }
}

export const getForgotPassword = async (req, res) => {
    try {
        
        res.render('forgot-password')
    } catch (error) {
        
    }
}

export const postForgotPassword = async (req, res) => {
    try {
        console.log(req.body);
        const {email} = req.body;
        const user = await findUserByEmail(email);
        if(user){
            const password = generateRandomPassword();
            console.log(password);
            await updatePassword(user, password);
            sendPasswordMail(email, password)
            return res.redirect('/signin')
        }
        res.render('forgot-password')
    } catch (error) {
        
    }
}

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