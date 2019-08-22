const router = require('express').Router();
const Todo = require('../models/Todo');
const verify = require('../verifyToken');

// BASE ROUTE: /api

// @GET
router.get('/todos', verify, (req, res) => {
    Todo.find({ userId: req.user._id }, (err, todos) => {
        if(err) {
            res.json({message: 'No todos found'});
        } else {
            let resTodos = [];

            todos.map(todo => {
                resTodos.push(todo);
            });

            res.json(resTodos);
        }
    })
});

// @POST
// <Header>: req.user
router.post('/addTodo', verify, (req, res) => {
    const newTodo = new Todo({
        name: req.body.name,
        userId: req.user._id
    });
    
    newTodo.save((err, todo) => {
        if(err){
            console.log(err)
                res.json({message: err})
        } else {
            res.json({message: 'Todo Aded'})
        }
    })
});

// @DELETE
// Params <URL_PARAM>: id
// <Header>: req.user
router.delete('/todos/:id', verify, (req, res) => {
    // console.log(req.params.id);
    Todo.deleteMany({ _id: req.params.id }, (err) => {
        if(err){
            res.json({message: err})
        } else {
            res.json({message: 'Deleted Sucesfuly'})
        }
    });
})

// @UPDATE
// Params <BODY>: name, completed
// Params <URL_PARAM>: id
// <Header>: req.user
router.put('/todos/:id', verify, (req, res) => {
    Todo.updateOne({ _id: req.params.id }, { name: req.body.name, completed: req.body.completed }, (err) => {
        if(err) {
            res.json({ message: err })
        } else {
            res.json({ message: 'Todo Updated' })
        }
    });
})

module.exports = router;