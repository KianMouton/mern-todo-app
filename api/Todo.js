const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const todoSchema = new Schema({
    text: {
        type: String,
        required: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
})

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    todos: [todoSchema]
})

//user Model
const user = mongoose.model('User', userSchema);

// Todo model
const Todo = mongoose.model('Todo', todoSchema);

module.exports = Todo;