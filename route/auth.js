const express = require('express')
const bycrypt=require('bcryptjs')
const router = express.Router()
const mongooes = require('mongoose')
const User = mongooes.model('User')
const jwt=require('jsonwebtoken')
const {JWT_SECRET}=require('../keys')
const reqiredLogin=require('../middleware/requireLogin')

router.get('/', (req, res) => {
    res.send('hello')
})

router.get('/protected',reqiredLogin,(req,res)=>{
    res.send("hello user")
})

router.post('/singup', (req, res) => {
    const { name, email, password } = req.body
    if (!name || !password || !email) {
        return res.status(422).json({
            error: "please add all the fields"
        })
    }
    bycrypt.hash(password,12).then(hashedpassword=>{
        User.findOne({ email: email })
        .then((saveuser) => {
            if (saveuser) {
                return res.status(422).json({
                    error: "user Alredy exitss"
                })
            }
            const user = new User({
                email,
                password:hashedpassword,
                name
            })
            user.save()
                .then(user => {
                    res.json({
                        message: "saved succesfully"
                    })
                }).catch(err => {
                    console.log(err)
                })
       
    })
    }).catch(err => {
            console.log(err)
        })
})

router.post('/singin',(req,res)=>{
    const {email,password}=req.body
    console.log(email,password)
    if(!email || !password){
        res.status(422).json({error:'please add email and password'})
    }
    User.findOne({email: email})
    .then(saveuser=>{
        if(!saveuser){
           return res.status(422).json({
                message:'Invalid Email or password'
            })
        
        }
        bycrypt.compare(password,saveuser.password)
        .then(domatch=>{
            if(domatch){
                // res.json({message:"succesfully signed in"})

                const token=jwt.sign({_id:saveuser._id},JWT_SECRET)
                res.json({token})

            }else{
                res.status(422).json({
                    error:'Invalid email or password'
                })
               
            }
        }).catch(e=>{
            console.log(e)
        })
    })
})

module.exports = router