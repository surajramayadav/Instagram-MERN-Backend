const jwt =require('jsonwebtoken')
const mongooes=require('mongoose')
const User=mongooes.model("User")
const {JWT_SECRET}=require('../keys')
module.exports=(req,res,next)=>{
    const {authorization}=req.headers
    if(!authorization){
      return res.status(401).json({error:'you must be logged in'})

    }
   const token= authorization.replace("Bearer ", "")
    jwt.verify(token,JWT_SECRET,(err,payload)=>{
        if(err){
            res.status(401).json({error:'you must be logged in'})

        }
        const {_id}=payload
        User.findById(_id).then(userdata=>{
            req.user=userdata
            next()
        })
       
    })
}