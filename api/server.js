const express = require('express');
const Port = 3001;
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }))

mongoose.connect(process.env.DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => console.error("error connecting to the database", err));

//Todo model
const Todo = require('./Todo.js');

app.get('/todos', (req, res) => {
    //fetch all todos
    Todo.find().then(todos => res.json(todos))
})

//post a todo
app.post('/todos/new', async (req, res) => {
    const text = req.body.text;

    if (!text) {
        console.log(req.body);
        return res.status(400).json({ message: 'Text is required' });
    }

    try {
        const newTodo = new Todo({
            text: text
        });
    
        //saves the todo to the database
        await newTodo.save();
    }
    catch(err) {
        console.log(req.body);
        console.error('unable to save user', err);
        res.status(500).send('Unable to save todo');
    }
});

app.delete('/todos/delete/:id', async (req, res) => {
    const id = req.params.id;
    
    try {
        const deleted = await Todo.findByIdAndDelete(id);
        res.json({ message: 'Todo deleted successfully', deleted: deleted });
    }
    catch(err) {
        console.error('Unable to delete todo', err);
        res.status(500).send('Unable to delete todo');
    }
});

app.post('/todos/check/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const clicked = await Todo.findById(id);
        if (!clicked) return res.status(404).send('Todo not found');
        clicked.completed = !clicked.completed;
        await clicked.save();
        res.json({ message: 'Todo checked successfully', checked: clicked });
    }
    catch(err) {
        console.log('Unable to check todo', err);
    }
})

app.post('/register', async (req, res) => {
    const { username, password } = req.body;
})

//port
app.listen(
    Port, 
    () => { console.log(`Server is running on http://localhost:${Port}`);
});