const expect = require('chai').expect;
const sinon = require('sinon');

const Todo = require("../../src/todos").Todo;
const TodosDAL = require("../../src/todos").TodosDAL;
const TodoService = require("../../src/todos").TodoService;

function testFuncReturnsErrObj({ testObject, errMessage, errStatusCode = 401 }) {
    expect(testObject).to.have.property("err");
    expect(testObject.err).to.have.property("message");
    expect(testObject.err).to.have.property("statusCode");
    expect(testObject.err.message).to.equal(errMessage);
    expect(testObject.err.statusCode).to.equal(errStatusCode);
}

describe("TodoService", function () {
    describe("getTasks", function () {
        it("should return an object with property err if no userId is provided", function (done) {
            TodoService.getTasks()
                .then(result => {
                    testFuncReturnsErrObj({ testObject: result, errMessage: "No UserId Provided", errStatusCode: 401 });
                    done();
                })
                .catch(err => done(err));
        });

        it("should return an object with a property todo that contains a list of todos", function (done) {
            sinon.stub(TodosDAL, "getTodosByUserId");
            TodosDAL.getTodosByUserId.returns([]);

            TodoService.getTasks("sample-user-id")
                .then(result => {
                    expect(result).to.have.property("todos");
                    expect(result.todos).to.be.an("array");

                    TodosDAL.getTodosByUserId.restore();
                    done();
                })
                .catch(err => {
                    TodosDAL.getTodosByUserId.restore();
                    done(err);
                });
        });
    });

    describe("addTask", function () {
        it("should return an object with property err if no argument is provided", function (done) {
            TodoService.addTask()
                .then(result => {
                    testFuncReturnsErrObj({ testObject: result, errMessage: "No Task Provided", errStatusCode: 401 });
                    done();
                })
                .catch(err => done(err));
        });

        it("should return an object with property err if no userId is provided", function (done) {
            let infos = {
                task: "sample task"
            };

            TodoService.addTask(infos)
                .then(result => {
                    testFuncReturnsErrObj({ testObject: result, errMessage: "No UserId Provided", errStatusCode: 401 });
                    done();
                })
                .catch(err => done(err));
        });

        it("should return an object with property err if no task is provided", function (done) {
            let infos = {
                userId: "sample-user-id"
            };

            TodoService.addTask(infos)
                .then(result => {
                    testFuncReturnsErrObj({ testObject: result, errMessage: "No Task Provided", errStatusCode: 401 });
                    done();
                })
                .catch(err => done(err));
        });

        it("should return an object with task info if everything goes well", function (done) {
            let infos = {
                userId: "sample-user-id",
                task: "do something"
            };

            sinon.stub(TodosDAL, "saveTodo");
            TodosDAL.saveTodo.returns(new Promise((resolve) => resolve({})));

            TodoService.addTask(infos)
                .then(result => {
                    expect(result).to.have.property("todo");
                    expect(result.todo).to.be.an("object");

                    TodosDAL.saveTodo.restore();
                    done();
                })
                .catch(err => {
                    TodosDAL.saveTodo.restore();
                    done(err);
                });
        });
    });

    describe("deleteTask", function () {
        it("should return an object with property err if no argument is provided", function (done) {
            TodoService.deleteTask()
                .then(result => {
                    testFuncReturnsErrObj({ testObject: result, errMessage: "No UserId Provided", errStatusCode: 401 });
                    done();
                })
                .catch(err => {
                    done(err);
                });
        });

        it("should return an object with property err if no taskId is provided", function (done) {
            let infos = {
                userId: "some-user-id"
            };

            TodoService.deleteTask(infos)
                .then(result => {
                    testFuncReturnsErrObj({ testObject: result, errMessage: "No TaskId Provided", errStatusCode: 401 });
                    done();
                })
                .catch(err => {
                    done(err);
                });
        });

        it("should return an object with property err if no userId is provided", function (done) {
            let infos = {
                taskId: "some-task-id"
            };

            TodoService.deleteTask(infos)
                .then(result => {
                    testFuncReturnsErrObj({ testObject: result, errMessage: "No UserId Provided", errStatusCode: 401 });
                    done();
                })
                .catch(err => {
                    done(err);
                });
        });

        it("should return an object with property oldTodo that contains info about deleted todo if everything goes well", function (done) {
            let infos = {
                userId: "some-user-id",
                taskId: "some-task-id"
            };

            sinon.stub(TodosDAL, "deleteTodo");
            TodosDAL.deleteTodo
                .withArgs({ userId: infos.userId, taskId: infos.taskId })
                .returns(new Promise((resolve) => {
                    resolve({ _id: infos.taskId });
                }));

            TodoService.deleteTask(infos)
                .then(result => {
                    expect(result).to.have.property('oldTodo');
                    expect(result.oldTodo).to.have.property("_id");
                    expect(result.oldTodo._id).to.equal(infos.taskId);

                    TodosDAL.deleteTodo.restore();
                    done();
                })
                .catch(err => {
                    TodosDAL.deleteTodo.restore();
                    done(err);
                })
        });
    });

    describe("completeTask", function () {
        it("should return an object with property err if no taskId is provided", function (done) {
            let infos = {
                userId: "some-user-id"
            };

            TodoService.completeTask(infos)
                .then(result => {
                    testFuncReturnsErrObj({ testObject: result, errMessage: "No TaskId Provided", errStatusCode: 401 });
                    done();
                })
                .catch(err => {
                    done(err);
                });
        });

        it("should return an object with property err if no userId is provided", function () {
            let infos = {
                taskId: "some-task-id"
            };

            TodoService.completeTask(infos)
                .then(result => {
                    testFuncReturnsErrObj({ testObject: result, errMessage: "No UserId Provided", errStatusCode: 401 });
                    done();
                })
                .catch(err => {
                    done(err);
                });
        });

        it("should return an object with property err if no task has been found with provided taskId");

        it("should return an object with property err if no task has been found with provided userId");

        it("should return an object with property todo with updated complete field to true if we pass the id of a todo that is false", function (done) {
            let infos = {
                userId: "some-user-id",
                taskId: "task-id"
            };

            let task = {
                _id: "task-id",
                complete: false
            };

            sinon.stub(TodosDAL, "save");
            TodosDAL.save
                .withArgs({ _id: infos.taskId, complete: true })
                .returns(new Promise((resolve) => {
                    task.complete = true;
                    resolve({ _id: infos.taskId, complete: true });
                }));

            TodoService.completeTask(infos)
                .then(result => {
                    expect(result).to.have.property('todo');
                    expect(result.todo).to.have.property('_id');
                    expect(result.todo._id).to.equal(infos.taskId);
                    expect(result.todo).to.have.property("complete");
                    expect(result.todo.complete).to.equal(true);
                    expect(task.complete).to.equal(true);
                })
                .catch(err => {
                    done(err);
                });
        });
        it("should return an object with property todo with updated complete field to false if we pass the id of a todo that is true");
    });

    //describe("addTaskHabit"); // Prend en arguments la tache et __week pour la semaine, __month pour le mois, __year pour l'année.
    //describe("completeTaskHabit") // Complete et duplique la tache habit qui est donnée avec complete a true. La last update de la nouvelle habit dupluqué sera la date de validation, et l'id sera retourner, l'habitude de base reste inchangé

});