const { validationResult } = require('express-validator');
const Todo = require('../models/Todo');
const statusCodes = require('../constants').statusCodes;

function isBoolean(value) {
    return value === true || value === false;
}

exports.getTodos = async (req, res, next) => {
    let todos;

    try {
        todos = await Todo.find({ userId: req.userId });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = statusCodes.UNAUTHORIZED;
        }
        err.url = req.url;
        return next(err);
    }

    if (!todos) {
        return res.status(401).json({
            message: "Failed to retreive data"
        });
    }

    res.status(200).json({
        message: "Successfully retreive tasks",
        data: {
            todos: todos
        }
    });
}

exports.postTodo = async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(statusCodes.UNAUTHORIZED).json({
            message: "Something Wrong With input",
            data: {
                errors: errors.errors
            }
        })
    }

    const {
        task
    } = req.body;

    if (!task) {
        return res.status(401).json({
            message: "You must provide a task"
        });
    }

    const todo = new Todo({
        userId: req.userId,
        task,
    });

    try {
        await todo.save();
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = statusCodes.UNAUTHORIZED;
        }
        err.url = req.url;
        return next(err);
    }

    res.status(200).json({
        message: "Successfully Save new Task",
        data: {
            todo: todo
        }
    })
}

exports.deleteTodo = async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(statusCodes.UNAUTHORIZED).json({
            message: "Can't delete this task",
            data: {
                errors: errors.errors
            }
        })
    }

    const { todoId } = req.params;

    let oldTask;

    try {
        oldTask = await Todo.findOneAndDelete({ _id: todoId, userId: req.userId });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = statusCodes.UNAUTHORIZED;
        }
        err.url = req.url;
        return next(err);
    }

    if (!oldTask) {
        return res.status(statusCodes.UNAUTHORIZED).json({
            message: 'There was a problem deleting this task'
        });
    }

    res.status(200).json({
        message: "Successfully delete task",
        data: {
            task: oldTask
        }
    })
}

exports.putUpdate = async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(statusCodes.UNAUTHORIZED).json({
            message: "Input Validation Failed",
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

    if (task === null && complete === null && archived === null) {
        return res.status(statusCodes.UNAUTHORIZED).json({
            message: "There is no data to be changed"
        });
    }

    if (!id) {
        return res.status(statusCodes.UNAUTHORIZED).json({
            message: "No task id provided"
        });
    }

    let todo;

    try {
        todo = await Todo.findOne({ _id: id });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = statusCodes.UNAUTHORIZED;
        }
        err.url = req.url;
        return next(err);
    }

    if (!todo) {
        return res.status(statusCodes.UNAUTHORIZED).json({
            message: "Failed to load task"
        });
    }

    if (task) {
        todo.task = task;
    }

    if (complete) {
        if (isBoolean(complete)) {
            return res.status(statusCodes.UNAUTHORIZED).json({
                message: "Data type must match Todo object field type"
            });
        }

        todo.complete = complete;
    }

    if (archived) {
        if (isBoolean(archived)) {
            return res.status(statusCodes.UNAUTHORIZED).json({
                message: "Data type must match Todo object field type"
            });
        }

        todo.archived = archived;
    }

    let success = false;

    try {
        success = await todo.save();
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = statusCodes.UNAUTHORIZED;
        }
        err.url = req.url;
        return next(err);
    }

    if (!success) {
        return res.status(statusCodes.UNAUTHORIZED).json({
            message: "Failed to update task"
        });
    }

    res.status(200).json({
        message: "Successfully Updated new Task",
        data: {
            todo: todo
        }
    })
}