const bcrypt=require('bcryptjs')
const mongoose=require('mongoose')
const validator=require('validator')
const jwt=require('jsonwebtoken')
const Task = require('../model/task')

const userSchema= mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
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
    },
    tokens:[{
        token:{
            type:String,
            require:true
        }
    }]
})

userSchema.virtual('tasks',{
    ref:'Task',
    localField:'_id',
    foreignField:'owner'
})

userSchema.methods.toJSON = function (){
    const user = this
    const userObject=user.toObject()

    delete userObject.password
    delete userObject.tokens
    return userObject
}

userSchema.methods.generateAuthToken = async function(){
    const user=this
    const token=jwt.sign({ _id : user._id.toString() },'kapkrish')
    user.tokens=user.tokens.concat({token})
    await user.save()
    return token
}


userSchema.statics.findByCredentials = async (email,password) => {
    const user= await User.findOne({ email : email })
    if(!user){
        throw new Error('Unable to login!')
    }
    const isMatch= await bcrypt.compare(password,user.password)
    if(!isMatch){
        throw new Error('Unable to login!')
    }
    return user
}

//hash password when save and update
userSchema.pre('save', async function (next) {
    const user=this

    if(user.isModified('password')){ // here check..... password change thayo hoy to
        user.password= await bcrypt.hash(user.password,8)

    }
    // console.log('just before saving!')

    next()
} )

// delete user tasks when user is delete
userSchema.pre('remove', async function(next) {
    const user=this
    await Task.deleteMany({ owner : user.id})
    next()
})

// create model
const User=mongoose.model('User', userSchema)

module.exports=User