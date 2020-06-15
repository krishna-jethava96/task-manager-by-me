const express=require('express')
const User=require('../model/user')
const router=express.Router()

router.post('/users',(req,res)=>{
    const user=new User(req.body)

    user.save().then(()=>{
        res.status(201).send(user)
    }).catch((e)=>{
        res.status(400).send(e)
    })
})

router.get('/users',(req,res) =>{
    User.find({}).then((users) =>{
        res.send(users)
    }).catch((e)=>{
        res.status(500).send()
    })
})

router.get('/user/:id',(req,res) =>{
    const _id=req.params.id 
    User.findById(_id).then((user)=>{
        if(!user){
            return res.status(404).send()
        }
        res.send(user)
    }).catch(()=>{
        res.status(500).send()
    })
})

router.patch('/users/:id', async (req,res)=>{

    const updates=Object.keys(req.body)
    const allowedUpdates=['name','email','password','age']
    const isValidOperation=updates.every((update)=> {
        return allowedUpdates.includes(update)
    })
    if(!isValidOperation){
        res.status(400).send({ Error: 'Invalid Updates..!' })
    }

    const _id=req.params.id
    try{
        const user= await User.findByIdAndUpdate(_id,req.body,{new:true,runValidators:true})
        if(!user){
            res.status(404).send()
        }
        res.send(user)
    }catch(e){
        res.status(500).send()
    }
})

router.delete('/user/:id', async (req,res) => {
    try{
        const user= await User.findByIdAndDelete(req.params.id)
        if(!user){
            res.status(404).send()
        }
        res.send(user)
    }catch(e){
        res.status(500).send()
    }
})

module.exports = router