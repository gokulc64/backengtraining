const jwt = require('jsonwebtoken')
const friendModel = require('../models/FriendModule')


const auth = async (rq, rs, next) => {
    try {
        const { token } = rq.cookies
        if (!token) return rs.json("No Token Found")
        const decode = await jwt.verify(token, "GOTAMU-KUN")
        if (!decode) rs.json("No User Found")
        const friend = await friendModel.findById(decode.userId)
        if (!friend) return rs.json("No User Found")
        rq.user = friend
        next()
    }
    catch (e) {
        rs.json({ message: e.message })
    }
}

module.exports = auth