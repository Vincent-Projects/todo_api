const Todo = require('./todo');

class TodosDAL {
    static getTodosByUserId(userId) {
        if (!userId)
            return false;

        return Todo.find({ userId: userId });
    }

    static saveTodo({ userId = undefined, task = undefined, projectId = null } = {}) {
        if (!userId)
            return false;

        if (!task)
            return false;

        const todo = new Todo({
            userId: userId,
            task,
            projectId
        });

        return todo.save();
    }

    static deleteTodo({ userId = undefined, todoId = undefined } = {}) {
        if (!userId)
            return false;

        if (!todoId)
            return false;

        return Todo.findOneAndDelete({ _id: todoId, userId: userId });
    }

    static getById(id) {
        if (!id) return false;

        if (typeof id !== "string") return false;

        return Todo.findById(id);
    }

    static getByProjectId({ userId = undefined, projectId = undefined } = {}) {
        if (!userId) return false;
        if (!projectId) return false;

        return Todo.find({ userId, projectId });
    }

    static getWithRecuringTime(userId) {
        if (!userId) return false;

        const recuringTimeOptions = {
            $exists: true,
            $ne: [null, undefined]
        };

        return Todo.find({ userId, recuringTime: recuringTimeOptions });
    }

    static save(todo) {
        if (!todo)
            return false;
        return todo.save();
    }

}

module.exports = TodosDAL;