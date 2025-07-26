const express=require('express')
const User=require('../models/userModel')
const AuthRouter=express.Router()
const {validateDetails}=require('../utils/validation')
const bcrypt=require('bcrypt')
AuthRouter.post('/signup',async(req,res)=>{
  const data=req.body;
    try{
        validateDetails(data)
        const {firstName,lastName,emailId,password}=data
        const passwordHash=await bcrypt.hash(password,10)
        const user=new User({
            firstName,
            lastName,
            emailId,
            password:passwordHash
        });
        await user.save()
        res.send('user data added succesfuly')
    }
    catch(err){
        res.status(500).send(err.message)
    } 
})

AuthRouter.post('/login',async(req,res)=>{
    const data=req.body;
    try{
        const user= await User.findOne({emailId:data.emailId})
        if(!user){
            throw new Error("user not found")
         }
        const isPasswordValid=await user.validatePassword(data.password)
        if(isPasswordValid){ 
            const jwtToken=await user.getJWT()
            res.cookie("jwtToken",jwtToken,{
                httpOnly: false,
                secure: true, // only true in production with httcrsrsps
                sameSite: "None", // do not use "None" with secure: false
                maxAge: 24 * 60 * 60 * 1000,
                path : "/"
                })
            res.send('success')  
        }
        else{
            res.status(400).send('invalid credintials')
        }
    }
    catch(err){
        res.status(400).send(err.message)
    }
})
AuthRouter.post('/logout',(req,res)=>{
    try{
             res.cookie('jwtToken',null,{expires:new Date(Date.now())})
            
             res.send('logout succesfully')
    }
    catch(err){
        res.status(400).send(err.message)
    }
   
})
module.exports=AuthRouter