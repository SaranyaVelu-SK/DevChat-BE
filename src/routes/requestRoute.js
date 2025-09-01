const express = require('express');
const { userAuth } = require('../Middlewares/auth');
const requestRouter = express.Router();
const { UserModel } = require('../Models/userModel');
const { connectionModel } = require('../Models/connectionModel');

requestRouter.post("/sendConnectionReq", userAuth, async (req, res) => {
    const userData = req.userData;
    res.send(userData.firstName + " has sent the connection request")
})

requestRouter.post('/request/send/:status/:userId', userAuth, async (req, res) => {
    try {
        const senderUserId = req.userData._id;
        const receiverUserId = req.params.userId;
        const status = req.params.status;
        //validation for receiver
        const isReceiverIdInDB = await UserModel.findById({ _id: receiverUserId });
        if (!isReceiverIdInDB) {
            return res.status(404).json({
                message: ' Request Receiver not found'
            })
        }
        //validation for request status
        const allowedStatus = ['interested', 'ignored'];
        const isStatusAllowed = allowedStatus.includes(status);
        if (!isStatusAllowed) {
            return res.status(404).json({
                message: ' Not a valid status'
            })
        }
        //validation for already existed connection

        const existingConnectionRequest = await connectionModel.findOne({
            $or: [
                { senderUserId, receiverUserId },
                {
                    senderUserId: receiverUserId, receiverUserId: senderUserId
                }
            ]
        })
        if (existingConnectionRequest) {
            return res.status(404).json({
                message: ' Request Connection Already Exists !'
            })
        }


        const connectionData = new connectionModel({
            senderUserId, receiverUserId, status
        });
        await connectionData.save();
        res.json({
            message: `connection saved successfully`,
            data: connectionData
        })
    } catch (err) {
        console.log(err);
        res.status(400).send(err.message)
    }

})

requestRouter.post('/request/review/:reviewStatus/:requestId', userAuth, async (req, res) => {
    try {
        const { reviewStatus, requestId } = req.params;
        const userData = req.userData;
        const allowedStatusForReview = ['accepted', 'rejected'];
        if (!allowedStatusForReview.includes(reviewStatus)) {
            return res.status(404).send("Not a valid status");
        }

        const connection = await connectionModel.findOne({
            status: 'interested',
            _id: requestId,
            receiverUserId: userData._id
        })
        console.log(connection)
        if (!connection) {
            return res.status(404).json({
                message: `Invalid connection request`
            })
        }

        connection.status = reviewStatus;
        const data = await connection.save();
        res.json({
            message: `connection request ${reviewStatus}`,
            data
        })
    } catch (err) {
        console.log(err);
        res.status(400).send(err.message)
    }
})

module.exports = requestRouter;