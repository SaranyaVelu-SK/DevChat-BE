const express = require('express');
const { userAuth } = require('../Middlewares/auth');
const requestRouter = express.Router();
const {UserModel} = require('../Models/userModel');
const { connectionModel } = require('../Models/connectionModel');

requestRouter.post("/sendConnectionReq",userAuth,async(req,res)=>{
 const userData = req.userData;
 res.send(userData.firstName + " has sent the connection request")
})

requestRouter.post('/request/send/:status/:userId',userAuth,async(req,res)=>{
    const senderUserId = req.user._id;
    const receiverUserId = req.params.userId;
    const status = req.params.status;
    //validation for receiver
    const isReceiverIdInDB = await UserModel.findById({_id:receiverUserId});
    if(!isReceiverIdInDB){
        return res.status(404).json({
            message:' Request Receiver not found'
        })
    }
    //validation for request status
    const allowedStatus = ['interested','ignored'];
    const isStatusAllowed = allowedStatus.includes(status);
    if(!isStatusAllowed){
        return res.status(404).json({
            message:' Not a valid status'
        })
    }
    //validation for already existed connection

    const existingConnectionRequest = await connectionModel.findOne({
        $or:[
            {senderUserId,receiverUserId},
            {
                senderUserId:receiverUserId,receiverUserId:senderUserId
            }
        ]
    })
    if(existingConnectionRequest){
         return res.status(404).json({
            message:' Request Connection Already Exists !'
        })
    }

    console.log(senderUserId,receiverUserId);
    
})

module.exports = requestRouter;