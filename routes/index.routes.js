const router = require("express").Router();
const Todo = require("../models/Todo.model");
const TodoModel = require('../models/Todo.model')
const {authMiddleware} = require('../middlewares');

router.get('/manish', (req, res) => {
  res.render('manish.hbs')
})

/* GET home page */
router.get("/", (req, res, next) => {
  TodoModel.find()
    .then((todos) => {
      res.render("index.hbs", {todos});
    })
    .catch(() => {
      next()
    })
});

// Handles GET requests to /add-form
router.get('/add-form', (req, res, next) => {
  res.render('todo/createform.hbs')
})

// Handles POST requests to /add-form
router.post('/add-form', (req, res, next) => {
  const {title, description} = req.body
  TodoModel.create({title, description})
    .then(() => {
      res.redirect('/')
    })
    .catch(() => {
      next('Todo creation failed')
    })

})

// Handles GET requests to /todo/637896224f8300cd87bb4486
router.get('/todo/:id', (req, res, next) => {
    const {id} = req.params
    TodoModel.findById(id)
      .then((todo) => {
          res.render('todo/detail.hbs', {todo})
      })
      .catch((err) => {
          next('Todo detail failed')
      });
})

// Handles GET requests to /todo/637896224f8300cd87bb4486/edit
router.get('/todo/:id/edit', authMiddleware, (req, res, next) => {
  const {id} = req.params
  TodoModel.findById(id)
    .then((todo) => {
        res.render('todo/editform.hbs', {todo})
    })
    .catch((err) => {
        next('Todo edit detail failed')
    });
})

// Handles POST requests to /todo/637896224f8300cd87bb4486/edit
router.post('/todo/:id/edit', authMiddleware, (req, res, next) => {
  const {id} = req.params
  const {title, description} = req.body
  TodoModel.findByIdAndUpdate(id, {title, description})
    .then(() => {
      res.redirect(`/todo/${id}`)
    })
    .catch((err) => {
      next('Todo Edit failed')
    });
})

// Handles GET requests to /todo/637896224f8300cd87bb4486/delete
router.get('/todo/:id/delete', authMiddleware, (req, res, next) => {
  const {id} = req.params
  TodoModel.findByIdAndDelete(id)
    .then(() => {
       res.redirect('/')
    })
    .catch((err) => {
        next('Todo Delete failed')
    });
})

module.exports = router;
