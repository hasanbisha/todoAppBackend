const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

// Import Routes
const authRoute = require('./routes/authentification');
const todoRoute = require('./routes/todos');

// Connect to database
mongoose.connect('mongodb://localhost:27017/todoApp', { useNewUrlParser: true }, (err) => {
    if(err) {
        console.log(err)
    }
});

// Import models
const Todo = require('./models/Todo');

const app = express();

// Middleware

// Cors
app.use(cors());
// Body Parser
app.use(bodyParser.json());
// Routes
app.use('/user', authRoute);
app.use('/api', todoRoute);



app.listen(5000, () => console.log('App started on port 5000'));