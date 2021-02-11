const express = require('express');
const validator = require('../middleware/validator');

const todosController = require('../controllers/todosController');

const todosRoutes = express.Router();

/**
 *  Base Routes /todos
 */

/**
* @api {get} /todos Get user's tasks
* @apiName GetTodos
* @apiGroup Todos
* @apiVersion 0.1.0
* @apiSampleRequest off
*
* @apiSuccess {String[]} todos        The user's tasks.
*
* @apiError {Object[]}   errors     Contains information about what's wrong for each fields.
* @apiError {Object}     err        Server Side error & DB errors
*/
todosRoutes.get('/', todosController.getTodos);

/**
* @api {post} /todos Add new task
* @apiName PostTodo
* @apiGroup Todos
* @apiVersion 0.1.0
* @apiSampleRequest off
*
* @apiSuccess {String} todos        The user's tasks.
*
* @apiError {Object[]}   errors     Contains information about what's wrong for each fields.
* @apiError {Object}     err        Server Side error & DB errors
*/
todosRoutes.post(
    '/add',
    validator.validatePostTask(),
    todosController.postTodo
);

/**
* @api {delete} /todos/delete/:todoId Delete task
* @apiName DeleteTodo
* @apiGroup Todos
* @apiVersion 0.1.0
* @apiSampleRequest off
*
* @apiSuccess {String} todos        The user's deleted tasks.
*
* @apiError {Object[]}   errors     Contains information about what's wrong for each fields.
* @apiError {Object}     err        Server Side error & DB errors
*/
todosRoutes.delete(
    '/delete/:todoId',
    validator.validateDeleteTaskId(),
    todosController.deleteTodo
);

/**
* @api {put} /todos/update Update task
* @apiName PutUpdate
* @apiGroup Todos
* @apiVersion 0.1.0
* @apiSampleRequest off
*
* @apiSuccess {String} todos        The user's updated tasks.
*
* @apiError {Object[]}   errors     Contains information about what's wrong for each fields.
* @apiError {Object}     err        Server Side error & DB errors
*/
todosRoutes.put(
    '/update',
    validator.validatePutTodo(),
    todosController.putUpdate
);

module.exports = todosRoutes;