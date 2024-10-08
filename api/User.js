const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const todo = require('./Todo.js');

const userSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
        unique: true
    },
    todos: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Todo" 
    }]
})

//user Model
const User = mongoose.model('User', userSchema);

module.exports = User;