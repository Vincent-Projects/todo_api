const express = require("express");
const validator = require('../middleware/validator');

const todosController = require("../controllers/todosController");

const todosRoutes = express.Router();

/**
 *  Base Routes /todos
 */

todosRoutes.get("/", todosController.getTodos);

todosRoutes.post(
    "/add",
    validator.validatePostTask(),
    todosController.postTodo
);

todosRoutes.delete(
    '/delete/:todoId',
    validator.validateDeleteTaskId(),
    todosController.deleteTodo
);

todosRoutes.put(
    '/update',
    validator.validatePutTodo(),
    todosController.putUpdate
);

module.exports = todosRoutes;