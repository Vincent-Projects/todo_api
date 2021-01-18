const express = require("express");

const todosController = require("../controllers/todosController");

const todosRoutes = express.Router();

/**
 *  Base Routes /todos
 */

todosRoutes.get("/", todosController.getTodos);
todosRoutes.post("/add", todosController.postTodo);
todosRoutes.delete('/delete/:todoId', todosController.deleteTodo);
todosRoutes.put('/update', todosController.putUpdate);

module.exports = todosRoutes;