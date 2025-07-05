const express=require('express')
const userAuthCheck = require('../middlewares/auth')
const connectionRequest = require('../models/connectionRequestModel')
const User = require('../models/userModel')
const UserRouter=express.Router()
const USER_SAVE_DATA=" firstName lastName age gender skills about "
// get all connections api 
// get requests api
// feed api 

UserRouter.get('/user/requests',userAuthCheck,async(req,res)=>{
    try{
        const loggedUser=req.user
        const requests=await connectionRequest.find({
            status:"interested",
            toUserId:loggedUser._id
        }).populate("fromUserId",USER_SAVE_DATA )
        res.json({message:"data" ,requests})
    }
    catch(err){
        res.status(400).send(err.message)
    }
})
UserRouter.get('/user/connections',userAuthCheck,async(req,res)=>{
    try{
            const loggedUser=req.user
            const connections=await connectionRequest.find({
               $or:[
                {toUserId:loggedUser,status:"accepted"},
                 {fromUserId:loggedUser,status:"accepted"}
               ]
            })
            .populate("fromUserId",USER_SAVE_DATA).populate("toUserId",USER_SAVE_DATA)

            const data=connections.map((row)=>{
                if(row.fromUserId._id.toString()===loggedUser._id){
                    return row.toUserId
                }
                return row.fromUserId
            })
            res.send(data)

    }
    catch(err){
        res.status(400).send(err.message)
    }
})

UserRouter.get('/feed',userAuthCheck,async(req,res)=>{
    try{
        const loggedUser=req.user

        // pagination 
        let limit=parseInt(req.query.limit) || 10
        let page = parseInt(req.query.page) || 1
        const skip=(page-1)*limit
        // fetch all connections 
        const connections=await connectionRequest.find({
            $or:[
                {toUserId:loggedUser},
                {fromUserId:loggedUser}
            ]
        }).select("fromUserId toUserId")
        // select unique users from connections with set data structure 
        const hideUsers=new Set()
        connections.forEach((req)=>{
            hideUsers.add(req.fromUserId.toString())
            hideUsers.add(req.toUserId.toString())
        })
        // now get feed data 
        const users=await User.find({
            $and:[
                     {_id:{ $nin:Array.from(hideUsers)}},
                     {_id:{$ne:loggedUser}}
            ]  
        }).select(USER_SAVE_DATA).skip(skip).limit(limit)
        res.send(users)

    }
    catch(err){
        res.status(400).send(err.message)
    }
})

module.exports=UserRouter