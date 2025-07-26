const jwt=require('jsonwebtoken')
const User=require('../models/userModel')
const userAuthCheck= async function (req,res,next){
    //get token from cookie
    // verify jwt and get user id
    // send user id 
    try{ 
        const {jwtToken}=req.cookies
        const jwtverifedData=jwt.verify(jwtToken,"Balu091")
        const userId=jwtverifedData._id
        const user=await User.findById({_id:userId})
        req.user=user
         next() 
    }
    catch(err){
        res.status(404).send(err.message,req.cookies.jwtToken)   
        console.log(err.message)
    }
    
   
}
module.exports=userAuthCheck