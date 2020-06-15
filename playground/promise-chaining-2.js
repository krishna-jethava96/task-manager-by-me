require('../src/db/mongoose')
const Task=require('../src/model/task')

// Task.findByIdAndDelete('5ee0c21575acbb10f03eb036').then((task)=>{
//     console.log(task)
//     return Task.countDocuments({ completed:false })
// }).then((count)=>{
//     console.log(count)
// }).catch((e)=>{
//     console.log(e)
// })


const deleteTaskAndCount =  async (id) => {

    const task= await Task.findByIdAndDelete(id)
    const count= await Task.countDocuments( { completed : false})
    
    return count
}

deleteTaskAndCount('5ee1ffecede1c111a491b0e8').then((count)=>{
    console.log('Remaining to complete task : ', count)
}).catch((e)=>{
    console.log('e : ' ,e)
})