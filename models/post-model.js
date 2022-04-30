const mongoose = require("mongoose")

const postSechema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },

    content: {
        type: String,
        required: true
    },

    author: {
        type: String,
        require: true,
        minlength: 1
    },

    date: {
        type: Date,
        default: Date.now,
        require: true
    },

    
})

module.exports = mongoose.model("Post", postSechema)