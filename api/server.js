const express = require('express');
const Port = 3001;
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
bcrypt = require('bcrypt');
require('dotenv').config();

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));
app.use(express.urlencoded({ extended: true }))

mongoose.connect(process.env.DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => console.error("error connecting to the database", err));

//User model
const User = require('./User.js');
//Todo model
const Todo = require('./Todo.js');

app.get('/user', async (req, res) => {

    const userId = req.cookies.userId;
    const user = await User.findById(userId);
    const username = user.username

    res.json(username);
})

app.get('/todos/', async (req, res) => {

    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    jwt.verify(token, process.env.JWT_TOKEN, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: "invalid token"})
        } 
    })
    //fetch all todos
    const userId = req.cookies.userId;
    try {
        const user = await User.findById(userId).populate('todos');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user.todos);
    } 
    catch (err) {
        console.error('Unable to fetch todos', err);
        res.status(500).send('Unable to fetch todos');
    }
})

//post a todo
app.post('/todos/new', async (req, res) => {
    const text = req.body.text;
    const userId = req.cookies.userId;

    if (!text) {
        console.log(req.body);
        return res.status(400).json({ message: 'Text is required' });
    }

    try {
        const newTodo = new Todo({
            text: text,
            creator: userId
        });

        //saves the todo to the database
        await newTodo.save();

        const user = await User.findById(userId);
        user.todos.push(newTodo._id);
        await user.save();
    
        console.log(newTodo);
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

// register endpoint
app.post('/register', async (req, res) => {
    const { username, password } = req.body;

    if (!username ||!password) {
        console.log(req.body);
        return res.status(400).json({ message: 'Username and password are required' });
    }

    // check if username already exists
    if (await User.findOne({ username })) {
        return res.status(400).json({ message: 'Username already exists' });
    }

    //hash the password to store in the database
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({ username, password: hashedPassword });
    await user.save();

    const token = jwt.sign({ username }, process.env.JWT_TOKEN, { expiresIn: "1h" });
    console.log(token);

    res.cookie('token', token, 
        { httpOnly: true }
    )
    res.cookie("userId", user._id, { httpOnly: true });
    res.json({ message: 'User registered successfully' });
    console.log(user);
    
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }
            
        const token = jwt.sign({ username }, process.env.JWT_TOKEN, { expiresIn: "1h" });

        //set token and userId to cookies
        res.cookie('token', token, { httpOnly: true});
        res.cookie("userId", user._id, { httpOnly: true });

        res.json({ message: 'Login successful', userId: user._id });
    }
    catch(err) {
        console.error('Unable to login user', err);
        res.status(500).send('Unable to login user');
    }
});

//port
app.listen(
    Port, 
    () => { console.log(`Server is running on http://localhost:${Port}`);
});