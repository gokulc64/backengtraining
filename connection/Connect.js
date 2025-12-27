const express = require("express");
const goatmu = express();
const mongoose = require('mongoose')


async function connectDB() {
    await mongoose.connect("mongodb+srv://im-gowtham-cd:gotamusama@backendtraining.ksisgva.mongodb.net/FriendBackendTraining").then((r) => {
        console.log("MongoDB Connected " + r);
    }).catch((e) => console.log(e))
}

module.exports = connectDB;