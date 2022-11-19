const mongoose = require('mongoose')

// 1. Connect the DB
require('../db')

// 2. Adding Data
const TodoModel = require('../models/Todo.model')

TodoModel.create([
    {title: 'Teach', description: 'Build a site'},
    {title: 'Groceries', description: 'Buy vegetables'},
])
    .then(() => {
        console.log('Todos added') 
    })
    .catch(() => {
        console.log('Seeding failed')
    })
    .finally(() =>{
        // 3. Closing the DB connection
        mongoose.connection.close()
        console.log('Connection closed')
    })

