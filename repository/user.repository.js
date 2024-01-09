import { JWT_SECRET } from "../config/server.config.js";
import UserModel from "../models/user.js"
import bcrypt from 'bcrypt'
import jwt from "jsonwebtoken";

export const findUserByEmail = async (email) => {
    try {
        const user = await UserModel.findOne({email});
        if(user){
            return user;
        }else{
            return null
        }
    } catch (error) {
        throw new Error('something went wrong with database')
    }
}


export const createUser = async (name, email, password) => {
    try {
        const hash = await bcrypt.hash(password, 5);
        const user = await UserModel.create({
            name: name,
            email: email,
            password: hash
        });
        return user;
    } catch (error) {
        throw new Error('something went wrong with database')
    }
}

export const comparePassword = async (user, password) => {
    try {
        const compare = await bcrypt.compare(password, user.password);
        if(compare){
            return true
        }else{
            return false;
        }
    } catch (error) {
        throw new Error('something went wrong with database')
    }
}

export const createToken = async(user) => {
    try {
        const secret = JWT_SECRET;
        const token = await jwt.sign({user}, secret);
        return token;
    } catch (error) {
        throw new Error('something went wrong with database')
    }
}

export const updatePassword = async (user, password) => {
    try {
        const hash = await bcrypt.hash(password, 5);
        const us = await UserModel.findByIdAndUpdate(user._id, {
            password: hash
        });
        return;
    } catch (error) {
        console.log(error)
        throw new Error('something went wrong with database')
    }
}

export const generateRandomPassword = (length = 10) => {
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_-+=";
    let password = "";

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        password += charset.charAt(randomIndex);
    }

    return password;
}