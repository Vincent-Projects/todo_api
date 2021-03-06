const expect = require('chai').expect;
const sinon = require('sinon');

const Todo = require('../../src/todos').Todo;
const TodosDAL = require('../../src/todos').TodosDAL;

describe("TodosDAL", function () {
    describe("getTodosByUserId", function () {
        it("should return false if no userId is provided", function () {
            expect(TodosDAL.getTodosByUserId()).to.be.false;
        });

        it("should return a promise if a userId is provided", function () {
            sinon.stub(Todo, 'find');
            Todo.find.returns(new Promise((resolve) => resolve()));

            expect(TodosDAL.getTodosByUserId("sample-user-id")).to.be.a("promise");

            Todo.find.restore();
        });
    });

    describe("saveTodo", function () {
        it("should return false if no argument is provided", function () {
            expect(TodosDAL.saveTodo()).to.be.false;
        });

        it("should return false if userId is not provided", function () {
            let infos = { task: "some task" };

            expect(TodosDAL.saveTodo(infos)).to.be.false;
        });

        it("should return false if task is not provided", function () {
            let infos = { userId: "some-user-id" };

            expect(TodosDAL.saveTodo(infos)).to.be.false;
        });

        it("should return a promise is both userId and task is provided", function () {
            let infos = {
                userId: "some-user-id",
                task: "some task"
            };

            sinon.stub(Todo.prototype, "save");
            Todo.prototype.save.returns(new Promise((resolve) => resolve()));

            expect(TodosDAL.saveTodo(infos)).to.be.a("promise");

            Todo.prototype.save.restore();
        });

        it("should return a promise if userId, task and projectId is provided", function () {
            let infos = {
                userId: "some-user-id",
                task: "some task",
                projectId: "some-project-id"
            };

            sinon.stub(Todo.prototype, "save");
            Todo.prototype.save.returns(new Promise((resolve) => resolve()));

            expect(TodosDAL.saveTodo(infos)).to.be.a("promise");

            Todo.prototype.save.restore();
        });
    });

    describe("deleteTodo", function () {
        it("should return false if no argument is provided", function () {
            expect(TodosDAL.deleteTodo()).to.be.false;
        });

        it("should return false if empty object if provided", function () {
            expect(TodosDAL.deleteTodo({})).to.be.false;
        });

        it("should return false if no todoId is provided", function () {
            const infos = { todoId: "some-todo-id" };

            expect(TodosDAL.deleteTodo(infos)).to.be.false;
        });

        it("should return false if no userId is provided", function () {
            const infos = { userId: "some-user-id" };

            expect(TodosDAL.deleteTodo(infos)).to.be.false;
        });

        it("should return a promise if both userId and todoId is provided", function () {
            let infos = {
                userId: "some-user-id",
                todoId: "some-todo-id"
            };

            sinon.stub(Todo, 'findOneAndDelete');
            Todo.findOneAndDelete.returns(new Promise((resolve) => resolve()));

            expect(TodosDAL.deleteTodo(infos)).to.be.a("promise");

            Todo.findOneAndDelete.restore();
        });
    });

    describe("getById", function () {
        it("should return false if no id is provided", function () {
            expect(TodosDAL.getById()).to.be.false;
        });

        it("should return false if id is not of type String", function () {
            const id = 9999985;

            expect(TodosDAL.getById(id)).to.be.false;
        });

        it("should return a promise if the id is provided", function () {
            const id = "some-id";

            sinon.stub(Todo, "findById");
            Todo.findById.returns(new Promise((resolve) => resolve()));

            expect(TodosDAL.getById(id)).to.be.a("promise");

            Todo.findById.restore();
        });
    });

    describe("getByProjectId", function () {
        it("should return false if no argument is provided", function () {
            expect(TodosDAL.getByProjectId()).to.be.false;
        });

        it("should return false if empty object is provided", function () {
            expect(TodosDAL.getByProjectId({})).to.be.false;
        });

        it("should return false if no userId is provided", function () {
            const infos = { projectId: "some-project-id" };

            expect(TodosDAL.getByProjectId({ infos })).to.be.false;
        });

        it("should return false if no projectId is provided", function () {
            const infos = { userId: "some-user-id" };

            expect(TodosDAL.getByProjectId({ infos })).to.be.false;
        });

        it("should return a promise if both userId and projectId is provided", function () {
            const infos = {
                userId: "some-user-id",
                projectId: "some-project-id"
            };


            sinon.stub(Todo, "find");
            Todo.find.returns(new Promise((resolve) => resolve()));

            expect(TodosDAL.getByProjectId(infos)).to.be.a("promise");

            Todo.find.restore();
        });
    });

    describe("getWithRecuringTime", function () {
        it("should return false if no argument is provided", function () {
            expect(TodosDAL.getWithRecuringTime()).to.be.false;
        });

        it("should return a promise if userId is provided", function () {
            const userId = "some-user-id";

            sinon.stub(Todo, "find");
            Todo.find.returns(new Promise((resolve) => resolve()));

            expect(TodosDAL.getWithRecuringTime(userId)).to.be.a("promise");

            Todo.find.restore();
        });
    });
});