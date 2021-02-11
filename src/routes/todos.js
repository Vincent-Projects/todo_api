const express = require('express');
const validator = require('../middleware/validator');

const todosController = require('../controllers/todosController');

const todosRoutes = express.Router();

/**
 *  Base Routes /todos
 */

/**
* @api {get} /todos Get all user's tasks
* @apiName GetTodos
* @apiGroup Todos
* @apiVersion 0.1.0
* @apiSampleRequest off
*
* @apiSuccess {String} todos        The user' tasks.
*
* @apiError {Object[]}   errors     Contains information about what's wrong for each fields.
* @apiError {Object}     err        Server Side error & DB errors
*/
todosRoutes.get('/', todosController.getTodos);

todosRoutes.post(
    '/add',
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