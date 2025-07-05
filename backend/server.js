const express=require('express')
const app=express()
const connectDB=require('./config/db')
const cookieParser=require('cookie-parser')
const AuthRouter=require('./routes/authRouter')
const ProfileRouter=require('./routes/profileRouter')
const ConnectionRequestRouter=require('./routes/requestRouter')
const UserRouter = require('./routes/userRouter')
// middleware for reading json
app.use(express.json())
app.use(cookieParser())

app.use('/',AuthRouter)
app.use('/',ProfileRouter)
app.use('/',ConnectionRequestRouter)
app.use('/',UserRouter)

// connection db and server listening
connectDB()
.then(()=>{
    console.log('connected succesfully')
    app.listen(3001,()=>
        {console.log('server is running on port 3001')})
})
.catch((err)=>{
    console.log(err)
})


