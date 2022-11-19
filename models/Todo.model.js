const {Schema, model} = require("mongoose");

const todoSchema = new Schema({
    title: String,
    description: String,    
});
  
const Todo = model("todo", todoSchema);
  
module.exports = Todo;
  