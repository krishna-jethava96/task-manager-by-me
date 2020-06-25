const express=require('express')
const Task=require('../model/task')
const auth=require('../middleware/auth')
const router=express.Router()

// why we use async-await bcaz async function default return a promise...so dont need to write again agai then() and catch()

router.post('/tasks', auth ,async (req,res)=>{
    //const task=new Task(req.body)
    const task= new Task({
        ...req.body,
        owner:req.user._id
    })
    try{
        await task.save()
        res.status(201).send(task)
    }catch(e){
        res.status(400).send(e)
    }
})


router.get('/tasks', auth ,async (req,res) =>{

    try{
        // await req.user.populate('tasks').execPopulate()
        // res.send(req.user.tasks)
        const tasks= await Task.find({ owner:req.user._id })
        res.status(200).send(tasks)
    }catch(e){
        res.status(500).send()
    }
})

router.get('/task/:id', auth ,async (req,res) =>{
    const _id=req.params.id
    
    try{
        // const task= await Task.findById(_id)
        const task= await Task.findOne({ _id , owner: req.user._id})
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

router.patch('/tasks/:id',auth, async (req,res)=>{

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
        const task= await Task.findOne({ _id: _id, owner:req.user._id})
        // const task= await Task.findById(_id)
        if(!task){
            res.status(404).send()
        }
        updates.forEach((update)=>{
            task[update]=req.body[update]
        })
        await task.save()
        res.send(task)
    }catch(e){
        res.status(500).send()
    }
})

router.delete('/task/:id', auth ,async (req,res) => {
    try{
        // const task= await Task.findByIdAndDelete(req.params.id)
        const task= await Task.findOneAndDelete({
            _id:req.params.id,
            owner:req.user._id 
        })
        if(!task){
            res.status(404).send()
        }
        res.send(task)
    }catch(e){
        res.status(500).send()
    }
})


module.exports=router