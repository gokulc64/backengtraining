const express = require("express");
const route = express.Router()
route.use(express.json())
const hashed = require('bcrypt')
const friendModel = require('../models/FriendModule')
const jwt = require('jsonwebtoken')
const auth = require('../middleware/Auth')

route.post('/login',async (rq, rs) => {
    try {
        const { name, email, password } = rq.body
        // const { nickname,password } = rq.params
        const login = await friendModel.findOne({ email: email })
        if (!login) return rs.json({ message: "No user Found" })
        if (login.role !== 'student') rs.json({ message: "This is Student Login" })
        const isname = login.name === name
        const ispassword = await hashed.compare(password, login.password)
        let errormsg = ""
        const token = jwt.sign({ userId: login._id }, "GOTAMU-KUN")
        // console.log(token)
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

route.get('/getallfriend',async (rq, rs) => {
    try {
        // const { token } = rq.cookies;
        // if(!token) rs.json("No Token Found")
        // console.log(token)
        // const decode = await jwt.verify(token,"GOTAMU-KUN")`
        // console.log(decode)
        const friend = await friendModel.find()
        // const friend = await friendModel.findById(decode.userId)
        // if(!friend) rs.json("No User Found")
        rs.json(friend)
    }
    catch (e) {
        rs.json({ message: e.message })
    }
})


route.get('/getfriend/:id', auth, async (rq, rs) => {
    try {
        const loggedUser = rq.user
        console.log(loggedUser)
        const { id } = rq.params
        const friend = await friendModel.findById(id)
        if(!friend)  return rs.json("No user")
        if(loggedUser._id.toString() !== friend._id && friend.role !== loggedUser.role) return rs.json("Access Denied")
        rs.json("Student Got")
    }
    catch (e) {
        rs.json({ message: e.message })
    }
})

route.delete('/deletefriend/:id',auth,async(rq,rs)=>{
    try{
        const { id } = rq.params;
        const loggedUser = rq.user
        if(loggedUser._id.toString() !== id) return rs.json("Access Denied")
        await friendModel.deleteOne({_id:id})
        rs.json("Successfully Deleted")
    }
    catch( e){
        rs.json({message:e.message})
    }
})

module.exports = route