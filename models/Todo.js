const mongoose = require('mongoose');

const TodoSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        length: 255
    },
    completed: {
        type: Boolean,
        default: false
    },
    userId: {
        type: String,
        required: true,
        length: 255
    }
})

const Todo = (module.exports = mongoose.model("Todo", TodoSchema));