const express=require('express')
const User=require('../model/user')
const auth=require('../middleware/auth')
const router=express.Router()

//Create User
router.post('/users',async (req,res)=>{
    const user=new User(req.body)
    try{
       await user.save()
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
        res.send(req.user)
    }catch(e){
        res.status(500).send()
    }
})

module.exports = router