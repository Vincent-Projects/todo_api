const Todo = require('./todo');

class TodosDAL {
    static getTodosByUserId(userId) {
        if (!userId)
            return false;

        return Todo.find({ userId: userId });
    }

    static saveTodo(userId, task) {
        if (!userId)
            return false;

        if (!task)
            return false;

        const todo = new Todo({
            userId: userId,
            task,
        });

        return todo.save();
    }

    static deleteTodo(userId, todoId) {
        if (!userId)
            return false;

        if (!todoId)
            return false;

        return Todo.findOneAndDelete({ _id: todoId, userId: userId });
    }

    static getById(id) {
        if (!id)
            return false;
        return Todo.findById({ _id: id });
    }

    static save(todo) {
        if (!todo)
            return false;
        return todo.save();
    }

}

module.exports = TodosDAL;