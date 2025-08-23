const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const validator = require('validator')
const { connectToDB } = require('./Config/database')
const { UserModel } = require('./Models/userModel')
const { signupValidation } = require('./helpers/signUpValidation');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const { userAuth } = require('./Middlewares/auth');

app.use(express.json());
app.use(cookieParser());
app.post('/signUp', async (req, res) => {
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

app.get('/feed', async (req, res) => {
    try {
        const usersFeed = await UserModel.find({});
        res.send(usersFeed)
    } catch (err) {
        res.status(400).send(err.message);
        console.log(err)
    }
})

app.get('/getUser', async (req, res) => {
    const email = req.body.email;
    try {
        const userData = await UserModel.findOne({ email: email });
        res.send(userData)
    } catch (err) {
        res.status(400).send(err.message);
        console.log(err)
    }
})

app.delete('/deleteUser', async (req, res) => {
    try {
        const userId = req.body.userId;
        await UserModel.findByIdAndDelete({ _id: userId });
        res.send("user deleted successfully")
    } catch (err) {
        res.status(400).send(err.message);
        console.log(err)
    }
})

app.patch('/updateUser', async (req, res) => {
    try {
        const { userId, ...data } = req.body;
        const ALLOWED_UPDATES = ["profilePic", "gender", "age", "skills", "description"];
        const isAllowed = Object.keys(data).every(k => ALLOWED_UPDATES.includes(k))
        console.log(isAllowed)
        if (isAllowed) {
            await UserModel.findByIdAndUpdate(userId, data, { returnDocument: 'after', runValidators: true });
            res.send('user updated succesfully')
        } else {
            console.log("Updates not allowed for name,email,password")
            throw new Error("Updates not allowed for name,email,password")
        }
    } catch (err) {
        res.status(400).send(err.message);
        console.log(err)
    }
})

app.get('/profile',userAuth, async (req, res) => {
 const userData = req.userData;
 console.log(userData);
 res.send(userData)
    
})

app.get('/signIn', async (req, res) => {
    try {
        const { email, password } = req.body;
        let userData;
        if (validator.isEmail(email)) {
            userData = await UserModel.findOne({ email: email });
        }
        if (userData) {
            let isValidPassword = await userData.compareUserPassword;
            if (isValidPassword) {
                const token = await userData.getJWT();
                res.cookie("jwtToken", token,{expires: new Date(Date.now() + (5 * 24 * 3600000))})   //5 days
                res.send("signin successfully")
            } else {
                throw new Error("wrong credentials")
            }
        }
    } catch (err) {
        res.status(400).send(err.message);
        console.log(err)
    }
})

app.post("/sendConnectionReq",userAuth,async(req,res)=>{
 const userData = req.userData;
 res.send(userData.firstName + " has sent the connection request")
})
connectToDB().then(() => {
    console.log("database connected successfully");
    app.listen(3000, () => {
        console.log("server running successfully")
    })
}).catch((err) => {
    console.log('Error Occured', err)
})