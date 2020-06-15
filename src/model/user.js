const mongoose=require('mongoose')
const validator=require('validator')

// create model
const User=mongoose.model('User',{
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        trim:true,
        lowercase:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Email is not valid!')
            }
        }
    },
    age:{
        type:Number,
        default:0,
        validate(value){
            if(value < 0){
                throw new Error('Provide positive number!')
            }
        }
    },
    password:{
       type:String,
       trim:true,
       minlength:7,
       validate(value){ //custom validate 
        if(value.toLowerCase().includes("password")){
            throw new Error('This password is not valid!')
        }
       }
    }
})

module.exports=User