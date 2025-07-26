const mongoose=require('mongoose');
const validator=require('validator')
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')
const userSchema=new mongoose.Schema(
    {
        firstName:{
            type:String,
            required:true,
            min:4,
            lowercase:true,
        },
        lastName:{
            type:String,
            required:true,
             lowercase:true,
        },
        emailId:{
            type:String,
            required:true,
            unique:true,
            trim:true,
             lowercase:true,
            validate(emailId){
                if(!validator.isEmail(emailId)){
                    throw new Error("ur email id is not valid ")
                }
            }
        },
        password:{
            type:String,
            unique:true,
            required:true,
            validate(password){
                if(!validator.isStrongPassword(password)){
                    throw new Error(" your password is not a strong passwoord ")
                }
            }
        },
        jobTitle:{
            type:String,
            default:"software develper",
        },
        age:{
            type:Number ,
            min:18,
        },
        gender:{
            type:String,
            validate(gender){
                if(!['male','female','other'].includes(gender)){
                    throw new Error("not a valid gender")
                }
            }

        },
        about:{
            type:String,
            default:" I am using DevTinder to connect with other developers and grow my network.",
        },
        photoUrl:{
            type:String,
           
        },
        skills:{
            type:[String],
            validate(skills){
                if(skills.length>10){
                    throw new Error(" skills not greater then 10 ")
                }
            }
        },
        company:{
            type:String,
            },
        location:{
            type:String,
            default:"India"
            
        },
        githubUrl:{
            type:String,

        },
        linkedInUrl:{
            type:String
        },

    },
    {timestamps:true}
)
userSchema.methods.validatePassword=async function(passwordInput){
    const user=this
    const passwoordHash=user.password
    const isPasswordValid= await bcrypt.compare(passwordInput,passwoordHash)
    return isPasswordValid
}

userSchema.methods.getJWT=async function (){
    const user=this
    const token=jwt.sign({_id:user._id},"Balu091",{expiresIn:'7d'})
    return token
    
}


const User=mongoose.model("User",userSchema);

module.exports=User
