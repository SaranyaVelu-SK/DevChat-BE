const express = require('express');
const userRouter = express.Router();
const { userAuth } = require('../Middlewares/auth');
const { connectionModel } = require('../Models/connectionModel');
const { UserModel } = require('../Models/userModel');
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

userRouter.get("/feed",userAuth,async(req,res)=>{
try{
        const loggedInUser = req.userData;
    const connections = await connectionModel.find({
       $or:[{
        senderUserId:loggedInUser._id
       },{
        receiverUserId:loggedInUser._id
       }]
    }).select("senderUserId  receiverUserId")

    const hiddenUsersFromFeed = new Set();
    connections.forEach(connection => hiddenUsersFromFeed.add(connection));

    const pageNo = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) ||10;
    limit = limit >50 ?50 : limit;

    const skip = (pageNo -1 )*limit;

    const userFeed = await UserModel.find({
        $and:[
            {_id:{$nin:Array.from(hiddenUsersFromFeed)}},
            {_id:{$ne:loggedInUser._id}}
        ]
    }).select(fieldsToPopulate).skip(skip).limit(limit)

    res.json({data:userFeed})
}catch(err){
    res.status(400).send(err.message);
        console.log(err)
}
})
module.exports = userRouter;