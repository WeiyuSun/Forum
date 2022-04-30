const mongoose = require("mongoose")
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 25
    },
 
    googleID: {
        type: String
    },

    date: {
        type: Date,
        default: Date.now
    },

    thumbnail: {
        type: String
    },

    email: {
        type: String
    },

    password: {
        type: String,
        maxlength: 512,
    }
})

module.exports = mongoose.model("User", userSchema)
 