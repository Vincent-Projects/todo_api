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
* @apiSuccessExample {json} Success Response Example :
*       {
*           "todos": [
*               {
*                   "id": "594d8az4f54fa8f4a5f6a4da",
*                   "task": "Eat cookies",
*                   "complete": "false",
*                    "archived": "false"
*               }          
*           ]
*       }
*           
*
* @apiError {Object[]}   errors     Contains information about what's wrong for each fields.
* @apiError {Object}     err        Server Side error & DB errors
*/
todosRoutes.get('/', todosController.getTodos);

/**
 * @api {post} /todos/add Add new task
 * @apiName PostTodo
 * @apiGroup Todos
 * @apiVersion 0.1.0
 * @apiSampleRequest off
 * 
 * @apiHeaderExample {json} Request Example :
 *      {
 *          "Content-Type": "application/json",
 *          "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
 *      }
 * 
 * @apiParam {String} task  The user task.
 * 
 * @apiParamExample {json} Request Body Example
 *      {
 *          "task": "Eat more cookies"
 *      }
 *
 * @apiSuccess {String} todo      The user new created task.
 * 
 * @apiSuccessExample {json} Success Response Example
 *      {
*           "id": "594d8az4f54fa8f4a5f6a4da",
*           "task": "Eat more cookies",
*           "complete": "false",
*           "archived": "false"
*       }
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
 * @apiParam {String} todoId    The id of the task to be deleted.
 * 
 * @apiSuccess {String} todo        The user's deleted task.
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
 * @apiDescription The params here are optional, which means you can either update the task, complete or archived fields but not required to give all three if you just want to update the complete. But at least one of them are required.
 * 
 * @apiParam {String} id            The id to the task to be deleted.
 * @apiParam {String} task          (optional) The modified task.
 * @apiParam {Boolean} complete     (optional) A boolean represent if the task is complete or not.
 * @apiParam {Boolean} archived     (optional) A boolean represent if the task is archived or not.
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