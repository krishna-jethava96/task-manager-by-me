const express=require('express')
require('./db/mongoose')
const userRouter= require('./router/user')
const taskRouter= require('./router/task')

const app=express()
const port=process.env.PORT || 3000

// app.use((req,res,next)=>{
//     res.status(503).send('Service Unavailable')
// })

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

app.listen(port,() =>{
    console.log('Server is up on port ' + port)
})

const Task=require('./model/task')
const User= require('./model/user')
const main = async () => {
    // console.log('main working')
    // task to user
    // const task = await Task.findById('5ef43de0c00d26179ca16f97')
    // await task.populate('owner').execPopulate()
    // console.log(task.owner)
    
    // user to tasks
    const user= await User.findById('5ef43dc4c00d26179ca16f95')
    await user.populate('tasks').execPopulate()
    console.log(user.tasks)

}

main()
