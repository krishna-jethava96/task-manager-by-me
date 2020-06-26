const mongoose=require('mongoose')
const validator=require('validator')

const taskSchema=new mongoose.Schema({
    description:{
        type:String,
        required:true,
        trim:true,
        set(value){
           value=value.replace(/ +/g,' ')
        //    console.log(value)
        return value
        }
        
    },
    completed:{
        type:Boolean,
        default:false
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        require:true,
        ref:'User'
    }
},{
    timestamps:true
})

const Task=mongoose.model('Task',taskSchema)

module.exports=Task