const Todo = require('../models/Todo');
const statusCode = require('../constants').statusCodes;

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

    res.status(200).json({
        message: "Successfully delete task",
        data: {
            task: oldTask
        }
    })
}

exports.putUpdate = async (req, res, next) => {
    const {
        id,
        task = null,
        complete = null,
        archived = null
    } = req.body;

    if (task === null && complete === null && archived === null) {
        return res.status(statusCode.UNAUTHORIZED).json({
            message: "There is no data to be changed"
        });
    }

    if (!id) {
        return res.status(statusCode.UNAUTHORIZED).json({
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
        return res.status(statusCode.UNAUTHORIZED).json({
            message: "Failed to load task"
        });
    }

    if (task) {
        todo.task = task;
    }

    if (complete) {
        if (isBoolean(complete)) {
            return res.status(statusCode.UNAUTHORIZED).json({
                message: "Data type must match Todo object field type"
            });
        }

        todo.complete = complete;
    }

    if (archived) {
        if (isBoolean(archived)) {
            return res.status(statusCode.UNAUTHORIZED).json({
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
        return res.status(statusCode.UNAUTHORIZED).json({
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