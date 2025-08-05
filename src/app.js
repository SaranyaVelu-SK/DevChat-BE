const express = require('express');
const app = express();
const { connectToDB } = require('./Config/database')
const{UserModel} =require('./Models/userModel')

app.use(express.json())
app.post('/signUp', async(req,res)=>{
    const signedUpUser = new UserModel(req.body);
    try{
        await signedUpUser.save();
        res.send("signed up successfully")
    }catch(err){
        res.status(400).send(err);
        console.log(err)
    }
})

app.get('/feed',async (req,res)=>{
    try{
        const usersFeed = await UserModel.find({});
        res.send(usersFeed)
    }catch(err){
        res.status(400).send(err);
        console.log(err)
    }
})

app.get('/getUser',async (req,res)=>{
    const email = req.body.email;
    try{
        const userData = await UserModel.findOne({email:email});
        res.send(userData)
    }catch(err){
        res.status(400).send(err);
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