const mongoose =require('mongoose');

const connectionSchema = new mongoose.Schema({
    senderUserId:{
        type:mongoose.Schema.Types.ObjectId
    },
    receiverUserId:{
        type:mongoose.Schema.Types.ObjectId
    },
    status:{
        type:String,
        enum:{
            values:["interested","ignored","accepted","rejected"],
            message:'{VALUE} is not a valid status'
        }
    }
},
{
    timestamps:true
},
);
const connectionModel = new mongoose.model("Connection",connectionSchema);

module.exports={connectionModel}