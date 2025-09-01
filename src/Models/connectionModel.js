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

connectionSchema.pre("save",function(next){     //never use arrow function
    
    if(this.senderUserId.equals(this.receiverUserId)){
        
       throw new Error(`you can't send connection request to yourself !`)
    }
    next(); //next() not similar to the one in express (req,res,next)
})
connectionSchema.index({senderUserId:1,receiverUserId:1})
const connectionModel = new mongoose.model("Connection",connectionSchema);

module.exports={connectionModel}