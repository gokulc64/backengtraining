const mongoose = require('mongoose')

const friendSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    nickname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique:true,
        required:true
    },
        role:{
        type:String,
        enum:['student','advisor'],
        required:true
    },
    password:{
        type:String,
        required:true,
        minLength:5
    },
    course:[{
        type: mongoose.Schema.Types.ObjectId,
        ref:'courseModel'
    }]
},{timestamps:true})

const friendModel = mongoose.model("friend", friendSchema)

module.exports = friendModel