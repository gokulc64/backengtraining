const express = require("express");
const route = express()
route.use(express.json())
const hashed = require('bcrypt')
const validator = require('validator')
const friendModel = require('../models/FriendModule')

// SignUp

route.post('/signup', async (rq, rs) => {
    try {
        const { name, nickname, email, role, password } = rq.body
        if (!validator.isEmail(email)) rs.json({ message: "Invalid Email" });
        if (!validator.isStrongPassword(password)) rs.json({ message: "Not a strong Password" });
        const hashPassword = await hashed.hash(password, 15)
        const newFriend = new friendModel({ name, nickname, email, role, password: hashPassword })
        await newFriend.save()
        rs.json({ message: "User Added", name: newFriend.name })
    }
    catch (e) {
        rs.json({ message: e.message })
    }
})

// Login

// route.post('/advisorlogin', async (rq, rs) => {
//     try {
//         const { name, email, password } = rq.body
//         // const { nickname,password } = rq.params
//         const login = await friendModel.findOne({ email: email })
//         if (!login) return rs.json({ message: "No user Found" })
//         if (login.role !== 'advisor') rs.json({ message: "This is Advisor Login" })
//         const isname = login.name === name
//         const ispassword = await hashed.compare(password, login.password)
//         let errormsg = ""
//         if (isname && ispassword) return rs.json({ message: `Login Successfull, Welcome , ${login.nickname}` })
//         else if (!isname && ispassword) errormsg = "Name";
//         else if (isname && !ispassword) errormsg = "Password";
//         else errormsg = "Both name and password"
//         return rs.json({ message: `${errormsg} WRONG` })

//     }
//     catch (e) {
//         rs.json({ message: e.message })
//     }
// })


// route.post('/studentlogin', async (rq, rs) => {
//     try {
//         const { name, email, password } = rq.body
//         // const { nickname,password } = rq.params
//         const login = await friendModel.findOne({ email: email })
//         if (!login) return rs.json({ message: "No user Found" })
//         if (login.role !== 'student') rs.json({ message: "This is Student Login" })
//         const isname = login.name === name
//         const ispassword = await hashed.compare(password, login.password)
//         let errormsg = ""
//         if (isname && ispassword) return rs.json({ message: `Login Successfull, Welcome , ${login.nickname}` })
//         else if (!isname && ispassword) errormsg = "Name";
//         else if (isname && !ispassword) errormsg = "Password";
//         else errormsg = "Both name and password"
//         return rs.json({ message: `${errormsg} WRONG` })

//     }
//     catch (e) {
//         rs.json({ message: e.message })
//     }
// })

// GET

route.get('/student/:age', async (rq, rs) => {
    try {
        const { age } = rq.params
        const ageN = Number(age)
        const friend = await friendModel.find({ age: { $lt: ageN } })
        if (!friend) return rs.json({ message: "No friend Found" })
        rs.json({ message: "Student Found", age: friend })
    }
    catch (e) {
        console.log(e.message)
    }

})

// POST

route.post('/studentData', async (rq, rs) => {
    try {
        const { name, nickname, age } = rq.body;
        const newFriend = new friendModel({
            name,
            nickname,
            age
        })
        await newFriend.save()
        if (!newFriend) return rs.json({ message: "Unable to add" })
        rs.send(newFriend)
    }
    catch (e) {
        rs.send(e.message)
    }

})

// DELETE

route.delete('/removestudent/:id', async (rq, rs) => {
    try {
        const { id } = rq.params
        const deletedFriend = await friendModel.findByIdAndDelete(id)
        // rs.send(deletedFriend)
        if (!deletedFriend) return rs.json({ message: "No Friend Found" })
        rs.json({ message: "Friend got Deleted", data: deletedFriend.name })
    }
    catch (e) {
        rs.json({ message: e.message })
    }

})

route.delete('/deleteallstudent', async (rq, rs) => {
    try {
        await friendModel.deleteMany()
        rs.json({ message: "Successfully Deleted" })
    }
    catch (e) {
        rs.json({ message: e.message })
    }
})

// PUT

route.put('/studentchange/:id', async (rq, rs) => {

    try {
        // const { nickname } = rq.body
        // const { name } = rq.params
        // const changeFriend = await friendModel.updateMany({name:name}, { $set: { nickname: nickname } })
        // rs.json({ messgage: "Successfully Updated", nickname: changeFriend.nickname })

        const { name, nickname, age } = rq.body
        const { id } = rq.params
        const changeFriend = await friendModel.findByIdAndUpdate(id, { name, nickname, age })
        rs.json({ messgage: "Successfully Updated", nickname: changeFriend })
    }
    catch (e) {
        rs.json({ message: e.message })
    }
})

route.use('/', (rq, rs) => rs.send("Welcome"))

module.exports = route;