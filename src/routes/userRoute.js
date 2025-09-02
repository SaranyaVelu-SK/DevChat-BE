const express = require('express');
const userRouter = express.Router();
const { userAuth } = require('../Middlewares/auth');
const { connectionModel } = require('../Models/connectionModel');
const fieldsToPopulate = "firstName lastName age gender skills";


userRouter.get('/user/requests/received', userAuth, async (req, res) => {
    try {
        const loggedInUser = req.userData;
        const requestsReceived = await connectionModel.find({
            receiverUserId: loggedInUser._id,
            status: 'interested'
        }).populate("senderUserId",fieldsToPopulate).populate("receiverUserId",["firstName"])
        res.json({message:'Data fetched successfully',
            data: requestsReceived 
        })
    } catch (err) {
        res.status(400).send(err.message);
        console.log(err)
    }
})

userRouter.get('/user/connections',userAuth,async(req,res)=>{
    try{
        const loggedInUser = req.userData;
    const connected = await connectionModel.find({
        $or:[
            {senderUserId:loggedInUser._id,status:"accepted"},
            {receiverUserId:loggedInUser._id,status:"accepted"}
        ]
    }).populate("senderUserId",["firstName"]).populate("receiverUserId",["firstName"])
    const data = connected.map((user)=>{
        
        if(user.senderUserId._id.toString() === loggedInUser._id.toString()){
            return user.receiverUserId
        }
        return user.senderUserId
    })
    res.json({
        message:'Connections List',
        data
    })
    }catch (err) {
        res.status(400).send(err.message);
        console.log(err)
    }
})
module.exports = userRouter;