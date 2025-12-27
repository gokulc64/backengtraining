const mongoose = require('mongoose')
const courseSchema = new mongoose.Schema({
    id:{
        type:Number,
        required:true
    },
    name:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    }
})

const courseModel = mongoose.model("course",courseSchema)

module.exports=courseModel