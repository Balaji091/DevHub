
const express=require('express')
const userAuthCheck = require('../middlewares/auth')
const connectionRequest=require('../models/connectionRequestModel')
const User = require('../models/userModel')
const ConnectionRequestRouter=express.Router()
ConnectionRequestRouter.post('/request/send/:status/:toUserId',userAuthCheck,async(req,res)=>{
    try{
        const fromUserId=req.user._id
        const toUserId=req.params.toUserId
        const status=req.params.status
        const allowedStatus=['ignored','interested']
        if(!allowedStatus.includes(status)){
            throw new Error("  not allowed of this status")
        }
        
        const toUser=await User.findOne({_id:toUserId})
        console.log("user"+toUserId)
        if(!toUser){
            throw new Error(" User not found")
        }
        const existingConnection= await connectionRequest.findOne({
            $or:[
                {fromUserId,toUserId},
                {fromUserId:toUserId,toUserId:fromUserId}
            ]
        })
        if(existingConnection){
            throw new Error(" connection already sent ")
        }

       const request= await connectionRequest({fromUserId,toUserId,status})
       await request.save()
       res.send("sent requets")

    }
    catch(err){
        res.status(404).send(err.message)
    }
})

ConnectionRequestRouter.post('/request/review/:status/:requestId',userAuthCheck,async(req,res)=>{
    
    try{
        const loggedUser=req.user
        const status=req.params.status
        const requestId=req.params.requestId
        const allowedStatus=['accepted','rejected']
        if(!allowedStatus.includes(status)){
             return res.status(400).send(" this status is not allowed")
        }
        const connection=await connectionRequest.findOne({
            toUserId:loggedUser,
            _id:requestId,
            status:"interested"
            
        })
        if(!connection){
            return res.status(400).send("not connection request there")
        }
        connection.status=status
        await connection.save()
        res.send('request accepted succesfully')

    }
    catch(err){
        res.status(400).send(err.message)
    }

})
module.exports=ConnectionRequestRouter