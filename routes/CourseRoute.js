const express = require('express')
const course = express()
course.use(express.json())
const courseModel = require('../models/CourseModule')
const auth = require('../middleware/Auth')

course.get('/course',auth ,async (rq,rs)=> {
    try{
        const courseDetails = await courseModel.find()
        rs.send(courseDetails)
    }
    catch(e){
        console.log(e.message)
    }
})

course.post('/courseadd',auth ,async(rq,rs)=>{
    try{
        const {id,name,price} = rq.body
        const newCourse = new courseModel({
            id,
            name,
            price
        })
        await newCourse.save()
        rs.send(newCourse)
    }
    catch(e){
        console.log(e.message)
    }
})

course.delete('/removeCourse/:id',async (rq,rs)=>{
    try{
        const {id} = rq.params
        await courseModel.deleteOne(id.Number)
        // console.log(deletedCourse)
        rs.json({message:"Course Got Deleted"})
    }
    catch(e){
        rs.json({message:e.message})
    }
})

module.exports = course;