const { validationResult } = require('express-validator');
const TodoService = require('../todos').TodoService;

const statusCodes = require('../constants').statusCodes;

exports.getTodos = async (req, res, next) => {
    const userId = req.userId;

    const { err, todos } = await TodoService.getTasks(userId);

    if (err)
        return next(err);

    res.status(200).json({
        message: 'Successfully retreive tasks',
        data: {
            todos: todos
        }
    });
};

exports.postTodo = async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(statusCodes.UNAUTHORIZED).json({
            message: 'Something Wrong With input',
            data: {
                errors: errors.errors
            }
        });
    }

    const {
        task
    } = req.body;

    const userId = req.userId;

    const { err, todo } = await TodoService.addTask({ userId, task });

    if (err)
        return next(err);

    res.status(200).json({
        message: 'Successfully Save new Task',
        data: {
            todo: todo
        }
    });
};

exports.deleteTodo = async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(statusCodes.UNAUTHORIZED).json({
            message: 'Can\'t delete this task',
            data: {
                errors: errors.errors
            }
        });
    }

    const { todoId } = req.params;
    const { userId } = req;

    const { err, oldTodo } = await TodoService.deleteTask({ userId, taskId: todoId });

    if (err)
        return next(err);

    res.status(200).json({
        message: 'Successfully delete task',
        data: {
            task: oldTodo
        }
    });
};

exports.putUpdate = async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(statusCodes.UNAUTHORIZED).json({
            message: 'Input Validation Failed',
            data: {
                errors: errors.errors
            }
        });
    }

    const {
        id,
        task = null,
        complete = null,
        archived = null
    } = req.body;

    const { err, todo } = await TodoService.update(id, task, complete, archived);

    if (err)
        return next(err);

    res.status(200).json({
        message: 'Successfully Updated new Task',
        data: {
            todo: todo
        }
    });
};