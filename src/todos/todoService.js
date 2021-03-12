const TodosDAL = require('./todosDAL');
const { statusCodes } = require('../constants');
const FREQUENCY = require('./constants');
function isBoolean(value) {
    return value === true || value === false;
}

function createErrorObject({ errMessage, errStatusCode }) {
    const error = new Error(errMessage);
    error.statusCode = errStatusCode;
    return error;
}

class TodoService {
    static async getTasks(userId) {
        if (!userId) {
            const error = new Error("No UserId Provided");
            error.statusCode = statusCodes.UNAUTHORIZED;
            return { err: error };
        }

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

    static async addTask({ userId = undefined, task = undefined } = {}) {

        if (!task) {
            const error = new Error('No Task Provided');
            error.statusCode = statusCodes.UNAUTHORIZED;
            return { err: error };
        }

        if (!userId) {
            const error = new Error('No UserId Provided');
            error.statusCode = statusCodes.UNAUTHORIZED;
            return { err: error };
        }

        let todo;

        try {
            todo = await TodosDAL.saveTodo({ userId, task });
        } catch (err) {
            if (!err.statusCode)
                err.statusCode = statusCodes.UNAUTHORIZED;
            return { err: err };
        }

        return { todo: todo };
    }

    static async deleteTask({ userId = undefined, taskId = undefined } = {}) {
        if (!userId) {
            const error = new Error("No UserId Provided");
            error.statusCode = statusCodes.UNAUTHORIZED;
            return { err: error };
        }

        if (!taskId) {
            const error = new Error("No TaskId Provided");
            error.statusCode = statusCodes.UNAUTHORIZED;
            return { err: error };
        }

        let oldTask;

        try {
            oldTask = await TodosDAL.deleteTodo({ userId, todoId: taskId });
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

    /**
     * @author Vincent Rouilhac
     * @deprecated since api version 1.0.0
     */
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

    static async completeTask({ userId = undefined, taskId = undefined } = {}) {
        if (!userId) {
            const error = new Error("No UserId Provided");
            error.statusCode = statusCodes.UNAUTHORIZED;
            return { err: error };
        }

        if (!taskId) {
            const error = new Error("No TaskId Provided");
            error.statusCode = statusCodes.UNAUTHORIZED;
            return { err: error };
        }

        let todo;

        try {
            todo = await TodosDAL.getById(taskId);
        } catch (err) {
            if (!err.statusCode) {
                err.statusCode = statusCodes.SERVER_ERROR;
            }
            return { err: err };
        }

        if (!todo) {
            const error = new Error("No Data Found");
            error.statusCode = statusCodes.UNAUTHORIZED;
            return { err: error };
        }

        if (todo.userId !== userId) {
            const error = new Error("No Permissions");
            error.statusCode = statusCodes.UNAUTHORIZED;
            return { err: error };
        }

        todo.complete = !todo.complete;
        let success;

        try {
            success = await todo.save();
        } catch (err) {
            if (!err.statusCode) {
                err.statusCode = statusCodes.SERVER_ERROR;
            }
            return { err: err };
        }

        if (!success) {
            const error = new Error("Problem updating data");
            error.statusCode = statusCodes.SERVER_ERROR;
            return { err: error };
        }

        return { todo: success };
    }

    static async addTaskHabit({
        task = undefined,
        frequency = undefined,
        recuringDate = undefined,
        userId = undefined,
        spacedNumberDays = undefined
    } = {}) {
        if (!task)
            return {
                err: createErrorObject({
                    errMessage: "No Task Provided",
                    errStatusCode: statusCodes.UNAUTHORIZED
                })
            };

        if (!frequency)
            return {
                err: createErrorObject({
                    errMessage: "No Frequency Provided",
                    errStatusCode: statusCodes.UNAUTHORIZED
                })
            };

        if (frequency !== FREQUENCY.WEEKLY &&
            frequency !== FREQUENCY.MONTHLY &&
            frequency !== FREQUENCY.YEARLY &&
            frequency !== FREQUENCY.CUSTOM)
            return {
                err: createErrorObject({
                    errMessage: "Invalid Frequency",
                    errStatusCode: statusCodes.UNAUTHORIZED
                })
            };

        if (!recuringDate)
            return {
                err: createErrorObject({
                    errMessage: "No RecuringDate Provided",
                    errStatusCode: statusCodes.UNAUTHORIZED
                })
            };

        if (!(recuringDate instanceof Date))
            return {
                err: createErrorObject({
                    errMessage: "Invalid Date Format",
                    errStatusCode: statusCodes.UNAUTHORIZED
                })
            };

        if (!userId)
            return {
                err: createErrorObject({
                    errMessage: "No UserId Provided",
                    errStatusCode: statusCodes.UNAUTHORIZED
                })
            };

        let customSpacedNumberDays = spacedNumberDays;

        if (frequency === "CUSTOM") {
            if (!spacedNumberDays)
                return {
                    err: createErrorObject({
                        errMessage: "No Recurence Time Provided",
                        errStatusCode: statusCodes.UNAUTHORIZED
                    })
                };

            if (typeof spacedNumberDays !== 'number')
                customSpacedNumberDays = parseInt(customSpacedNumberDays);

            if (isNaN(customSpacedNumberDays))
                return {
                    err: createErrorObject({
                        errMessage: "Invalid Custom Recuring Time",
                        errStatusCode: statusCodes.UNAUTHORIZED
                    })
                };
        }


        let habit;
        let recuringTime = null;
        let recuringDay = null;
        let recuringWeekDay = null;
        let startedRecuringTime = null;

        switch (frequency) {
            case FREQUENCY.CUSTOM:
                recuringTime = customSpacedNumberDays;
                startedRecuringTime = recuringDate;
                break;
            case FREQUENCY.WEEKLY:
                recuringWeekDay = FREQUENCY.WEEKDAYS[recuringDate.getDay()]
                break;
            case FREQUENCY.MONTHLY:
                recuringDay = recuringDate.getDate();
                break;
            case FREQUENCY.YEARLY:
                break;
            default:
                return {
                    err: createErrorObject({
                        errMessage: "Invalid Frequency",
                        errStatusCode: statusCodes.UNAUTHORIZED
                    })
                };
        }

        try {
            habit = await TodosDAL.saveHabit({
                task: task,
                userId: userId,
                recuringDate: (frequency === FREQUENCY.YEARLY) ? recuringDate : null, // if yearly habits
                recuringTime,
                recuringDay,
                recuringWeekDay,
                startedRecuringTime
            });
        } catch (err) {
            if (!err.statusCode)
                err.statusCode = statusCodes.SERVER_ERROR;
            return { err: err };
        }

        if (!habit)
            return {
                err: createErrorObject({
                    errMessage: "Something Wrong Savind Data",
                    errStatusCode: statusCodes.UNAUTHORIZED
                })
            };

        return { habit };
    }
}

module.exports = TodoService;