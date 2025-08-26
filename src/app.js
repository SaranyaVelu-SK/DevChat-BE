const express = require('express');
const app = express();
const bcrypt = require('bcrypt');

const { connectToDB } = require('./Config/database')
const { UserModel } = require('./Models/userModel')
const { signupValidation } = require('./helpers/signUpValidation');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const { userAuth } = require('./Middlewares/auth');
const authRouter = require('./routes/authRoute');
const profileRouter = require('./routes/profileRoute');
const requestRouter = require('./routes/requestRoute');

app.use(express.json());
app.use(cookieParser());
app.use('/',authRouter);
app.use('/',profileRouter);
app.use('/',requestRouter)


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

connectToDB().then(() => {
    console.log("database connected successfully");
    app.listen(3000, () => {
        console.log("server running successfully")
    })
}).catch((err) => {
    console.log('Error Occured', err)
})