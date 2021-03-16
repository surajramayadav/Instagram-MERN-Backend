const express = require('express')

const router = express.Router()
const mongooes = require('mongoose')
const requireLogin=require('../middleware/requireLogin')
const Post =mongooes.model('Post')
router.post('/createpost',requireLogin,(req,res)=>{
    const{title,body}=req.body
    if(!title || !body){
        return res.status(422).json({error:'please add all fields'})
    }
    // console.log(req.user)
    // res.send("ok")

    req.user.password=undefined
    const post =new Post({
        title,
        body,
        postedBy:req.user
    })
    post.save()
    .then(result=>{
        res.json({post:result})
    }).catch(e=>{
        console.log(e)
    })
})

module.exports=router