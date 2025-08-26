const express = require('express');
const { userAuth } = require('../Middlewares/auth');
const requestRouter = express.Router();

requestRouter.post("/sendConnectionReq",userAuth,async(req,res)=>{
 const userData = req.userData;
 res.send(userData.firstName + " has sent the connection request")
})

module.exports = requestRouter;