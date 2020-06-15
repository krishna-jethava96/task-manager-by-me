const express=require('express')
const Task=require('../model/task')
const router=express.Router()

// why we use async-await bcaz async function default return a promise...so dont need to write again agai then() and catch()

router.post('/tasks', async (req,res)=>{
    const task=new Task(req.body)
    try{
        await task.save()
        res.status(201).send(task)
    }catch(e){
        res.status(400).send(e)
    }
})

router.get('/tasks', async (req,res) =>{

    try{
        const tasks= await Task.find({})
        res.status(200).send(tasks)
    }catch(e){
        res.status(500).send()
    }
    // Task.find({}).then((users) =>{
    //     res.send(users)
    // }).catch((e)=>{
    //     res.status(500).send()
    // })
})

router.get('/task/:id',async (req,res) =>{
    const _id=req.params.id
    
    try{
        const task= await Task.findById(_id)
        if(!task){
            return res.status(404).send()
        }
        res.status(200).send(task)
    }catch(e){
        res.status(500).send()
    }
    // Task.findById(_id).then((task)=>{
    //     if(!task){
    //         return res.status(404).send()
    //     }
    //     res.send(task)
    // }).catch(()=>{
    //     res.status(500).send()
    // })
})

router.patch('/tasks/:id', async (req,res)=>{

    const updates=Object.keys(req.body)
    const allowedUpdates=['description','completed']
    const isValidOperation=updates.every((update)=> {
        return allowedUpdates.includes(update)
    })
    if(!isValidOperation){
        res.status(400).send({ Error: 'Invalid Updates..!' })
    }

    const _id=req.params.id
    try{
        const task= await Task.findByIdAndUpdate(_id,req.body,{new:true,runValidators:true})
        if(!task){
            res.status(404).send()
        }
        res.send(task)
    }catch(e){
        res.status(500).send()
    }
})

router.delete('/task/:id', async (req,res) => {
    try{
        const task= await Task.findByIdAndDelete(req.params.id)
        if(!task){
            res.status(404).send()
        }
        res.send(task)
    }catch(e){
        res.status(500).send()
    }
})


module.exports=router