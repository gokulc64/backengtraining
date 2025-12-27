const express = require("express");
const route = express()
route.use(express.json())
const hashed = require('bcrypt')
const friendModel = require('../models/FriendModule')
const jwt = require('jsonwebtoken')
const auth = require('../middleware/Auth')


route.post('/login', auth, async (rq, rs) => {
    try {
        const { name, email, password } = rq.body
        // const { nickname,password } = rq.params
        const login = await friendModel.findOne({ email: email })
        if (!login) return rs.json({ message: "No user Found" })
        if (login.role !== 'advisor') rs.json({ message: "This is Advisor Login" })
        const isname = login.name === name
        const ispassword = await hashed.compare(password, login.password)
        let errormsg = ""
        const token = await jwt.sign({ userId: login._id }, "GOTAMU-KUN")
        rs.cookie("token", token)
        if (isname && ispassword) return rs.json({ message: `Login Successfull, Welcome , ${login.nickname} + Token : ${token}` })
        else if (!isname && ispassword) errormsg = "Name";
        else if (isname && !ispassword) errormsg = "Password";
        else errormsg = "Both name and password"
        return rs.json({ message: `${errormsg} WRONG` })

    }
    catch (e) {
        rs.json({ message: e.message })
    }
})

route.patch('/assigncourse/:id', async (rq, rs) => {
    try {
        const { id } = rq.params
        const { courseId } = rq.body
        const student = await friendModel.findById(id)
        // console.log(student)
        if (!student) return rs.json("No user Found")
        const us = await friendModel.findByIdAndUpdate(id, { $push:{course: courseId }})
        // console.log(us)
        rs.json("Course assigned Successfully")
    }
    catch (e) {
        rs.json({ message: e.message })
    }
})


module.exports = route