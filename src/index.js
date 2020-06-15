const express=require('express')
require('./db/mongoose')
const User=require('./model/user')
const Task=require('./model/task')

const app=express()
const port=process.env.PORT || 3000

app.use(express.json())

app.post('/users',(req,res)=>{
    const user=new User(req.body)

    user.save().then(()=>{
        res.status(201).send(user)
    }).catch((e)=>{
        res.status(400).send(e)
    })
})

app.get('/users',(req,res) =>{
    User.find({}).then((users) =>{
        res.send(users)
    }).catch((e)=>{
        res.status(500).send()
    })
})

app.get('/user/:id',(req,res) =>{
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

// why we use async-await bcaz async function default return a promise...so dont need to write again agai then() and catch()

app.post('/tasks', async (req,res)=>{
    const task=new Task(req.body)
    try{
        await task.save()
        res.status(201).send(task)
    }catch(e){
        res.status(400).send(e)
    }
})

app.get('/tasks', async (req,res) =>{

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

app.get('/task/:id',async (req,res) =>{
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

app.patch('/tasks/:id', async (req,res)=>{

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

app.delete('/task/:id', async (req,res) => {
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

app.listen(port,() =>{
    console.log('Server is up on port ' + port)
})