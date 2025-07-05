const express=require('express')
const ProfileRouter=express.Router()
const userAuthCheck=require('../middlewares/auth')
const {validateAllowedFields}=require('../utils/validation')
const User = require('../models/userModel')
const bcrypt=require('bcrypt')

ProfileRouter.get('/profile',userAuthCheck,async(req,res)=>{
    try{
       
         res.send(req.user)
    }
    catch(err){
        res.status(400).send(err.message)   
    }
})

ProfileRouter.patch('/profile',userAuthCheck,async(req,res)=>{
    // allowed keys to update 
    try{
          const isUpdateAllowed=validateAllowedFields(req.body)
          if(!isUpdateAllowed){
             throw new Error("updation is not allowed ")
          }
          const loggedUser=req.user
          Object.keys(req.body).every((key)=>(loggedUser[key]=req.body[key]))
          await loggedUser.save()
          res.send("profile updated succesfully")
    }
    catch(err){
        res.send(err.message)
    }
        
    })

ProfileRouter.patch('/profile/password',userAuthCheck,async(req,res)=>{
    try{
        const user=req.user;
        const changedPassword=req.body.changedPassword
        const changedPasswordHash=await bcrypt.hash(changedPassword,10)
        await User.findByIdAndUpdate({_id:user._id},{password:changedPasswordHash})
        res.send("password changed succesfully")

    }
    catch(err){
        res.status(404).send(err.message)
    }
})
module.exports=ProfileRouter
