const express=require('express')
const multer=require('multer')
const sharp=require('sharp')
const { sendWelcomeEmail,sendCancelationEmail } = require('../emails/account')
const User=require('../model/user')
const auth=require('../middleware/auth')
const router=express.Router()

//Create User
router.post('/users',async (req,res)=>{
    const user=new User(req.body)
    try{
        await user.save()
        sendWelcomeEmail(user.email,user.name)
        const token=await user.generateAuthToken()
        res.status(201).send({ user,token })
    }catch(e){
        res.status(400).send(e)
    }
})

//User login
router.post('/user/login', async (req,res) => {
    try{
    const user=await User.findByCredentials(req.body.email,req.body.password)
    const token=await user.generateAuthToken()
    res.send({ user,token })
    }catch(e){
        res.status(400).send()
    }
})

//User Logout
router.post('/user/logout', auth , async (req,res) =>{
    try{
        req.user.tokens =req.user.tokens.filter((token)=>{
            return token.token !== req.token
        })
        await req.user.save()
        res.send()
    }catch(e){
        res.status(500).send()
    }
})

//User Logout from All Devices
router.post('/user/logoutAll', auth , async (req,res)=>{
    try{
        req.user.tokens = []
        await req.user.save()
        res.send()

    }catch(e){
        res.status(500).send()
    }
})

//Read Users
router.get('/user/me',auth, async (req,res) =>{
        res.send(req.user) //send back user which is the requested user 
    // try{
    //     const users= await User.find({})
    //     res.send(users)
    // }catch(e){
    //     res.status(500).send()
    // }
})


//Update User
router.patch('/users/me', auth , async (req,res)=>{

    const updates=Object.keys(req.body)
    const allowedUpdates=['name','email','password','age']
    const isValidOperation=updates.every((update)=> allowedUpdates.includes(update))
    if(!isValidOperation){
        res.status(400).send({ Error: 'Invalid Updates..!' })
    }
    try{
            updates.forEach((update)=>{
            req.user[update]=req.body[update]
        })
        await req.user.save()
        // const user= await User.findByIdAndUpdate(_id,req.body,{new:true,runValidators:true})
        res.send(req.user)
    }catch(e){
        res.status(500).send(e)
    }
})

//Delete User 
router.delete('/user/me', auth , async (req,res) => {
    try{
        await req.user.remove()
        sendCancelationEmail(req.user.email,req.user.name)
        res.send(req.user)
    }catch(e){
        res.status(500).send(e)
    }
})

const upload=multer({
    limits:{
        fileSize:1000000  //1mb = 1000000  bytes
    },
    fileFilter(req,file,cb){
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            return cb(new Error('provide an image file'))
        }
        cb(undefined,true)
    }
})

//create avatar
router.post('/user/me/avatar', auth ,upload.single('avatar'), async (req,res) => {
        const buffer=await sharp(req.file.buffer).resize({ width:250,height:250 }).png().toBuffer()
        req.user.avatar = buffer
        await req.user.save()
        res.send()
},(error,req,res,next) => {
    res.status(400).send({ error : error.message})
})

//delete avatar
router.delete('/user/me/avatar',auth, async (req,res) => {
    req.user.avatar = undefined
    await req.user.save()
    res.send()
})

// read avatar
router.get('/user/:id/avatar',async (req,res)=>{
    try{
        const user= await User.findById(req.params.id)
        if(!user || !user.avatar){
            throw new Error()
        }
        res.set('Content-Type','image/png')
        res.send(user.avatar)
    }catch(e){
        res.status(404).send()
    }
})

module.exports = router