const express = require('express');
const { signupValidation } = require('../helpers/signUpValidation');
const bcrypt = require('bcrypt');
const {UserModel} = require('../Models/userModel');
const validator = require('validator');

const authRouter = express.Router();

authRouter.post('/signUp', async (req, res) => {
    try {
        const validatedData = signupValidation(req.body);
        let hashedPassword = await bcrypt.hash(validatedData.password, 10)
        const signedUpUser = new UserModel({ ...validatedData, password: hashedPassword });
        await signedUpUser.save();
        res.send("signed up successfully")
    } catch (err) {
        res.status(400).send(err.message);
        console.log(err)
    }
})

authRouter.get('/signIn', async (req, res) => {
    try {
        const { email, password } = req.body;
        let userData;
        if (validator.isEmail(email)) {
            userData = await UserModel.findOne({ email: email });
        }
        if (userData) {
            let isValidPassword = await userData.compareUserPassword(password);
            if (isValidPassword) {
                const token = await userData.getJWT();
                res.cookie("jwtToken", token,{expires: new Date(Date.now() + (5 * 24 * 3600000))})   //5 days
                res.send("signin successfully")
            } else {
                throw new Error("wrong credentials")
            }
        }else{
            throw new Error("no user found")
        }
    } catch (err) {
        res.status(400).send(err.message);
        console.log(err)
    }
})

authRouter.post('/logout',async(req,res)=>{
    res.cookie('jwtToken',null,{expires:new Date(Date.now())});
    res.send("Logged Out successfully")
})

module.exports = authRouter;