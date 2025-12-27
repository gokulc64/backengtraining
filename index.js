const express = require("express");
const goatmu = express();
const route = require('./routes/FriendRoute')
const admin = require('./routes/AdminRoute')
const friend = require('./routes/StudentRoute')
const course = require('./routes/CourseRoute')
const cookieParser = require('cookie-parser')
const cors = require('cors')
goatmu.use(cors())
goatmu.use(cookieParser())
goatmu.use(express.json())

const connectDB = require('./connection/Connect')

connectDB().then(()=>{
    goatmu.listen(6868, () => console.log("Browser Connected"));
})

goatmu.use('/admin', admin)
goatmu.use('/student', friend)
goatmu.use('/friend', route)
goatmu.use('/course', course)
