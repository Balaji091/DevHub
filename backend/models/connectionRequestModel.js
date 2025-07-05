const mongoose=require('mongoose')
const User = require('./userModel')
const connectionRequestModelSchema=new mongoose.Schema({
    fromUserId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:User
    },
     toUserId:{
         type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:User
    },
    status:{
        type:String,
        required:true,
        enum:{
            values:['ignored','interested','accepted','rejected'],
             message: '{VALUE} is not a valid role'

        }
    },
},
{timestamps:true}
)
connectionRequestModelSchema.pre("save",function(next){
    const request=this
    if(request.fromUserId.equals(request.toUserId)) {
        throw new Error("from userId and touserId not same ")
    }
    next()
    
})
connectionRequestModelSchema.index({fromUserId:1,toUserId:1})
const connectionRequest= new mongoose.model('ConnectionRequest',connectionRequestModelSchema)
module.exports=connectionRequest
