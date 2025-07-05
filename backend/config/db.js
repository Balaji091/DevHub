const mongoose=require('mongoose')
const url="mongodb+srv://balaji:Balu%40091@balaji.4kzr11z.mongodb.net/devTinder"
const connectDB=async ()=>{
    await mongoose.connect(url)
}
module.exports=connectDB