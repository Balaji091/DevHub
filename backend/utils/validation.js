const validator=require('validator')
const validateDetails=function (data){
    
    const {firstName,lastName,emailId,password}=data
    if (!firstName || !lastName || !emailId || !password) {
        throw new Error("Please fill all details");
    }

    else if (!validator.isEmail(emailId)){
        throw new Error(" please enter valid email ")
    }
      else if (!validator.isStrongPassword(password)){
        throw new Error(" please enter strong password ")
    }
}
const validateAllowedFields=function(data){
    const allowedUpdateFields=['age','gender','about','skills','photoUrl']
    const isUpdateAllowed=Object.keys(data).every((k)=>allowedUpdateFields.includes(k))
    return isUpdateAllowed
}

module.exports={validateDetails,validateAllowedFields}