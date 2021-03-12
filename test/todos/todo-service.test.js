const chai = require('chai');
chai.use(require('chai-datetime'));
const expect = require('chai').expect;
const sinon = require('sinon');

const Todo = require("../../src/todos").Todo;
const TodosDAL = require("../../src/todos").TodosDAL;
const TodoService = require("../../src/todos").TodoService;
const FREQUENCY = require('../../src/todos/constants');

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

        it("should return an object with property err if no userId is provided", function (done) {
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

        it("should return an object with property err if no task has been found with provided arguments", function (done) {
            let infos = {
                userId: "some-user-id",
                taskId: "some-task-id"
            };

            sinon.stub(TodosDAL, "getById");
            TodosDAL.getById.returns(new Promise((resolve) => resolve(undefined)));

            TodoService.completeTask(infos)
                .then(result => {
                    testFuncReturnsErrObj({ testObject: result, errMessage: "No Data Found", errStatusCode: 401 });

                    TodosDAL.getById.restore();
                    done();
                })
                .catch(err => {
                    TodosDAL.getById.restore();
                    done(err);
                });
        });

        it("should return an object with property err if the userId provided does not match the userId of task fetch by taskId", function () {
            let infos = {
                userId: "some-user-id",
                taskId: "some-task-id"
            };

            sinon.stub(TodosDAL, "getById");
            TodosDAL.getById.returns(new Promise((resolve) => {
                let task = {
                    userId: "some-other-user-id"
                };

                resolve(task);
            }));

            TodoService.completeTask(infos)
                .then(result => {
                    testFuncReturnsErrObj({ testObject: result, errMessage: "No Permissions", errStatusCode: 401 });
                    done();
                })
                .catch(err => {
                    TodosDAL.getById.restore();
                    done(err);
                });
        });

        it("should return an object with property todo with updated complete field to true if we pass the id of a todo that is false", function (done) {
            let infos = {
                userId: "some-user-id",
                taskId: "task-id"
            };

            let task = {
                _id: "task-id",
                userId: "some-user-id",
                complete: false,
                save: function () {
                    return new Promise((resolve) => {
                        resolve(this);
                    });
                }
            };

            sinon.stub(TodosDAL, "getById");
            TodosDAL.getById
                .withArgs(task._id)
                .returns(new Promise((resolve) => {
                    resolve(task);
                }));

            TodoService.completeTask(infos)
                .then(result => {
                    expect(result).to.have.property('todo');
                    expect(result.todo).to.have.property('_id');
                    expect(result.todo._id).to.equal(infos.taskId);
                    expect(result.todo).to.have.property("complete");
                    expect(result.todo.complete).to.equal(true);

                    TodosDAL.getById.restore();
                    done();
                })
                .catch(err => {
                    TodosDAL.getById.restore();
                    done(err);
                });
        });
        it("should return an object with property todo with updated complete field to false if we pass the id of a todo that is true", function () {
            let infos = {
                userId: "some-user-id",
                taskId: "task-id"
            };

            let task = {
                _id: "task-id",
                userId: "some-user-id",
                complete: true,
                save: function () {
                    return new Promise((resolve) => {
                        resolve(this);
                    });
                }
            };

            sinon.stub(TodosDAL, "getById");
            TodosDAL.getById
                .withArgs(task._id)
                .returns(new Promise((resolve) => {
                    resolve(task);
                }));

            TodoService.completeTask(infos)
                .then(result => {
                    expect(result).to.have.property('todo');
                    expect(result.todo).to.have.property('_id');
                    expect(result.todo._id).to.equal(infos.taskId);
                    expect(result.todo).to.have.property("complete");
                    expect(result.todo.complete).to.equal(false);

                    TodosDAL.getById.restore();
                    done();
                })
                .catch(err => {
                    TodosDAL.getById.restore();
                    done(err);
                });
        });
    });

    describe("addTaskHabit", function () {
        it("should return an object with property err if no task is provided", function (done) {
            TodoService.addTaskHabit()
                .then(result => {
                    testFuncReturnsErrObj({ testObject: result, errMessage: "No Task Provided", errStatusCode: 401 });
                    done();
                })
                .catch(err => {
                    done(err);
                });
        });

        it("should return an object with property err if no frequency is provided", function (done) {
            let infos = {
                task: "some-task"
            };

            TodoService.addTaskHabit(infos)
                .then(result => {
                    testFuncReturnsErrObj({ testObject: result, errMessage: "No Frequency Provided", errStatusCode: 401 });
                    done();
                })
                .catch(err => {
                    done(err);
                });
        });

        it("should return an object with property err if frequency is invalid from the list", function (done) {
            let infos = {
                task: "some-task",
                frequency: "non valid frequency"
            };

            TodoService.addTaskHabit(infos)
                .then(result => {
                    testFuncReturnsErrObj({ testObject: result, errMessage: "Invalid Frequency", errStatusCode: 401 });
                    done();
                })
                .catch(err => {
                    done(err);
                });
        });

        it("should return an object with property err if no recuringDate is provided", function (done) {
            let infos = {
                task: "some-task",
                frequency: FREQUENCY.WEEKLY
            };

            TodoService.addTaskHabit(infos)
                .then(result => {
                    testFuncReturnsErrObj({ testObject: result, errMessage: "No RecuringDate Provided", errStatusCode: 401 });
                    done();
                })
                .catch(err => {
                    done(err);
                });
        });

        it("should return an object with property err if recuringDate is not of type Date", function (done) {
            let infos = {
                task: "some-task",
                frequency: "WEEK",
                recuringDate: "some non valid date"
            };

            TodoService.addTaskHabit(infos)
                .then(result => {
                    testFuncReturnsErrObj({ testObject: result, errMessage: "Invalid Date Format", errStatusCode: 401 });
                    done();
                })
                .catch(err => {
                    done(err);
                });
        });

        it("should return an object with property err if no userId is provided", function (done) {
            let infos = {
                task: "some-task",
                frequency: "WEEK",
                recuringDate: new Date()
            };

            TodoService.addTaskHabit(infos)
                .then(result => {
                    testFuncReturnsErrObj({ testObject: result, errMessage: "No UserId Provided", errStatusCode: 401 });
                    done();
                })
                .catch(err => {
                    done(err);
                });
        });

        it("should return an object with property err if no spacedNumberDay is provided when frequency is set to CUSTOM", function (done) {
            let infos = {
                task: "some-task",
                frequency: "CUSTOM",
                recuringDate: new Date(),
                userId: "some-user-id"
            };

            TodoService.addTaskHabit(infos)
                .then(result => {
                    testFuncReturnsErrObj({ testObject: result, errMessage: "No Recurence Time Provided", errStatusCode: 401 });
                    done();
                })
                .catch(err => {
                    done(err);
                })
        });

        it("should return a task as habit with recuringWeekDay set to MONDAY if the given date is set to monday and frequency to WEEK", function (done) {
            let infos = {
                task: "some-task",
                frequency: FREQUENCY.WEEKLY,
                recuringDate: new Date('March 08, 2021 15:00:00'), // March 03 is Monday
                userId: "some-user-id"
            };

            sinon.stub(TodosDAL, "saveHabit");
            TodosDAL.saveHabit
                .withArgs({
                    task: infos.task,
                    userId: infos.userId,
                    recuringDate: null,
                    recuringTime: null,
                    recuringDay: null,
                    recuringWeekDay: FREQUENCY.MONDAY,
                    startedRecuringTime: null
                })
                .returns(new Promise((resolve) => {
                    resolve({
                        _id: "sample-id",
                        userId: infos.userId,
                        recuringWeekDay: FREQUENCY.MONDAY
                    })
                }));

            TodoService.addTaskHabit(infos)
                .then(result => {
                    console.log(result);
                    expect(result).to.have.property("habit");
                    expect(result.habit).to.have.property("recuringWeekDay");
                    expect(result.habit.recuringWeekDay).to.equal("MONDAY");
                    TodosDAL.saveHabit.restore();
                    done();
                })
                .catch(err => {
                    TodosDAL.saveHabit.restore();
                    done(err);
                });
        });

        it("should return a task as habit with recuringDay set to a number ranged to 0-30 based on the date if frequency is MONTH", function (done) {
            let infos = {
                task: "some-task",
                frequency: FREQUENCY.MONTHLY,
                recuringDate: new Date('March 08, 2021 15:00:00'), // March 03 is Monday
                userId: "some-user-id"
            };

            sinon.stub(TodosDAL, "saveHabit");
            TodosDAL.saveHabit
                .withArgs({
                    task: infos.task,
                    userId: infos.userId,
                    recuringDate: null,
                    recuringTime: null,
                    recuringDay: 8,
                    recuringWeekDay: null,
                    startedRecuringTime: null
                })
                .returns(new Promise((resolve) => {
                    resolve({
                        _id: "sample-id",
                        userId: infos.userId,
                        recuringDay: 8
                    })
                }));

            TodoService.addTaskHabit(infos)
                .then(result => {
                    console.log(result);
                    expect(result).to.have.property("habit");
                    expect(result.habit).to.have.property("recuringDay");
                    expect(result.habit.recuringDay).to.equal(8);
                    TodosDAL.saveHabit.restore();
                    done();
                })
                .catch(err => {
                    TodosDAL.saveHabit.restore();
                    done(err);
                });
        });

        it("should return a task as habit with recuringDate set to a specific date if the given date is provided and frequency to YEAR", function (done) {
            let infos = {
                task: "some-task",
                frequency: FREQUENCY.YEARLY,
                recuringDate: new Date('March 08, 2021 15:00:00'), // March 03 is Monday
                userId: "some-user-id"
            };

            sinon.stub(TodosDAL, "saveHabit");
            TodosDAL.saveHabit
                .withArgs({
                    task: infos.task,
                    userId: infos.userId,
                    recuringDate: new Date('March 08, 2021 15:00:00'),
                    recuringTime: null,
                    recuringDay: null,
                    recuringWeekDay: null,
                    startedRecuringTime: null
                })
                .returns(new Promise((resolve) => {
                    resolve({
                        _id: "sample-id",
                        userId: infos.userId,
                        recuringDate: new Date('March 08, 2021 15:00:00')
                    })
                }));

            TodoService.addTaskHabit(infos)
                .then(result => {
                    console.log(result);
                    expect(result).to.have.property("habit");
                    expect(result.habit).to.have.property("recuringDate");
                    expect(result.habit.recuringDate).to.equalDate(new Date('March 08, 2021 15:00:00'));
                    TodosDAL.saveHabit.restore();
                    done();
                })
                .catch(err => {
                    TodosDAL.saveHabit.restore();
                    done(err);
                });
        });

        it("should return a task as habit with recuringTime set to a specific number if the given spacedNumberDay is provided and frequency to CUSTOM", function (done) {
            let infos = {
                task: "some-task",
                frequency: FREQUENCY.CUSTOM,
                recuringDate: new Date('March 08, 2021 15:00:00'), // March 03 is Monday
                userId: "some-user-id",
                spacedNumberDays: 4
            };

            sinon.stub(TodosDAL, "saveHabit");
            TodosDAL.saveHabit
                .withArgs({
                    task: infos.task,
                    userId: infos.userId,
                    recuringDate: null,
                    recuringTime: infos.spacedNumberDays,
                    recuringDay: null,
                    recuringWeekDay: null,
                    startedRecuringTime: infos.recuringDate
                })
                .returns(new Promise((resolve) => {
                    resolve({
                        _id: "sample-id",
                        userId: infos.userId,
                        startedRecuringTime: new Date('March 08, 2021 15:00:00'),
                        recuringTime: infos.spacedNumberDays
                    })
                }));

            TodoService.addTaskHabit(infos)
                .then(result => {
                    console.log(result);
                    expect(result).to.have.property("habit");
                    expect(result.habit).to.have.property("startedRecuringTime");
                    expect(result.habit.startedRecuringTime).to.equalDate(new Date('March 08, 2021 15:00:00'));
                    expect(result.habit).to.have.property("recuringTime");
                    expect(result.habit.recuringTime).to.equal(infos.spacedNumberDays);
                    TodosDAL.saveHabit.restore();
                    done();
                })
                .catch(err => {
                    TodosDAL.saveHabit.restore();
                    done(err);
                });
        });
    }); // Prend en arguments la tache et __week pour la semaine, __month pour le mois, __year pour l'année, et une date pour la date a partir de quand ( week ca prends le jours, mois ca prends le numero et année ca prends tout ).
    //describe("completeTaskHabit") // Complete et duplique la tache habit qui est donnée avec complete a true. La last update de la nouvelle habit dupluqué sera la date de validation, et l'id sera retourner, l'habitude de base reste inchangé
    //describe("deleteTaskHabit");
});