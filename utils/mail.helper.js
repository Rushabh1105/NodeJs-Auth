// Importing required modules and dependencies
import nodeMailer from "nodemailer";
import { PASS, USER } from "../config/server.config.js";

// Create mail transporter
const transporter = nodeMailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: USER,
        pass: PASS
    }
});

// Sending welcome email
export const sendWelcomeMail = async(email) => {
    const mailOptions = {
        from:  '"NodeJS Authenticator" 👻" <maverick42@ethereal.email>', // Sender email address
        to: email,                // Recipient email address
        subject: 'Welcome to Our Site',
        text: 'Thank you for signing up! We are excited to have you as a member of our community.'
    };
    sendMail(mailOptions)
}

// Sending signin alert
export const sendSignInAlert = async(email) => {
    const mailOptions = {
        from: '"NodeJS Authenticator" 👻" <maverick42@ethereal.email>', // Sender email address
        to: email,      // Replace with the admin or alert recipient email address
        subject: 'Signin Alert',
        text: `User with email ${email} has signed in.`
    };
    sendMail(mailOptions);
}

// Sending password reset mail
export const sendPasswordMail = async(email, password) => {
    const mailOptions = {
        from: '"NodeJS Authenticator" 👻" <maverick42@ethereal.email>', // Sender email address
        to: email,      // Replace with the admin or alert recipient email address
        subject: 'Account Recovery',
        text: `Your new password is ${password}, do not share with anyone`
    }
    sendMail(mailOptions)
}

// sending notification about password reset
export const passwordChangeMail = async(email) => {
    const mailOptions = {
        from: '"NodeJS Authenticator" 👻" <maverick42@ethereal.email>', // Sender email address
        to: email,      // Replace with the admin or alert recipient email address
        subject: 'Password change alert',
        text: `Your account password has been changed`
    }
    sendMail(mailOptions)
}

// Send mail function
const sendMail = async(info) => {
    try {
        await transporter.sendMail(info);
        console.log("Message sent");
        return;
    } catch (error) {
        console.log(error);
        throw {error};
    }
}

