const express=require('express')
const mongoose=require('mongoose')
const { MONGOURI } = require('./keys')

const app=express()
const PORT=5000

 
mongoose.connect(MONGOURI,{
    useNewUrlParser:true,
    useUnifiedTopology:true
})
mongoose.connection.on('connected',()=>{
    console.log("connected to mongodb")

})
mongoose.connection.on('error',(err)=>{
    console.log("error connecting",err)
})


require('./model/user')
require('./model/post')
// get all json to my app
//use before route
app.use(express.json()) 

app.use(require('./route/auth'))
app.use(require('./route/post'))

const customMiddleware=(req,res,next)=>{
    console.log("middleware exexuted")
    next()
}




// 9Y6V1QZqiQlgBDkX   
// app.use(customMiddleware) use for all route

// app.get('/',(req,res)=>{
//     console.log("home")
//     res.send('hello world')
// })

// app.get('/about',customMiddleware,(req,res)=>{
//     console.log("about")
//     res.send('about')
// })
app.listen(PORT,()=>{
    
    console.log("server is running on",PORT)

})