const TodosDAL = require('./todosDAL');
const { statusCodes } = require('../constants');

function isBoolean(value) {
    return value === true || value === false;
}

class TodoService {
    static async getTodos(userId) {
        let todos;

        try {
            todos = await TodosDAL.getTodosByUserId(userId);
        } catch (err) {
            if (!err) {
                err.statusCode = statusCodes.UNAUTHORIZED;
            }
            return { err: err };
        }

        if (!todos) {
            const error = new Error('Failed to retreive data');
            error.statusCode = statusCodes.UNAUTHORIZED;
            return { err: error };
        }

        return { todos };
    }

    static async addTask(userId, task) {

        if (!task) {
            const error = new Error('No task provided');
            error.statucCode = statusCodes.UNAUTHORIZED;
            return { err: error };
        }

        let todo;

        try {
            todo = await TodosDAL.saveTodo(userId, task);
        } catch (err) {
            if (!err.statusCode)
                err.statusCode = statusCodes.UNAUTHORIZED;
            return { err: err };
        }

        return { todo: todo };
    }

    static async deleteTask(userId, taskId) {
        let oldTask;

        try {
            oldTask = await TodosDAL.deleteTodo(userId, taskId);
        } catch (err) {
            if (!err.statusCode) {
                err.statusCode = statusCodes.UNAUTHORIZED;
            }
            return { err: err };
        }

        if (!oldTask) {
            const error = new Error('There was a problem deleting this task');
            error.statusCode = statusCodes.UNAUTHORIZED;
            return { err: error };
        }

        return { oldTodo: oldTask };
    }

    static async update(id, task, complete, archived) {
        if (task === null && complete === null && archived === null) {
            const error = new Error('There is no data to be changed');
            error.statusCode = statusCodes.UNAUTHORIZED;
            return { err: error };
        }

        if (!id) {
            const error = new Error('No task id provided');
            error.statusCode = statusCodes.UNAUTHORIZED;
            return { err: error };
        }

        let todo;

        try {
            todo = await TodosDAL.getById(id);
        } catch (err) {
            if (!err.statusCode)
                err.statusCode = statusCodes.UNAUTHORIZED;

            return { err: err };
        }

        if (!todo) {
            const error = new Error('Failed to load task');
            error.statusCode = statusCodes.UNAUTHORIZED;
            return { err: error };
        }

        if (task) {
            todo.task = task;
        }

        if (complete !== null && complete !== undefined) {
            if (!isBoolean(complete)) {
                const error = new Error('Data type must match Todo object field type');
                error.statusCode = statusCodes.UNAUTHORIZED;
                return { err: error };
            }

            todo.complete = complete;
        }

        if (archived !== null && archived !== undefined) {
            if (!isBoolean(archived)) {
                const error = new Error('Data type must match Todo object field type');
                error.statusCode = statusCodes.UNAUTHORIZED;
                return { err: error };
            }

            todo.archived = archived;
        }

        let success = false;

        try {
            success = await TodosDAL.save(todo);
        } catch (err) {
            if (!err.statusCode)
                err.statusCode = statusCodes.UNAUTHORIZED;

            return { err: err };
        }

        if (!success) {
            const error = new Error('Failed to update task');
            error.statusCode = statusCodes.UNAUTHORIZED;
            return { err: error };
        }

        return { todo };
    }
}

module.exports = TodoService;