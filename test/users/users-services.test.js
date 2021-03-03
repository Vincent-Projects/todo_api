const expect = require("chai").expect;
const sinon = require("sinon");

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UsersDAL = require('../../src/users').UsersDAL;
const UserService = require('../../src/users').UserService;

describe("User Services", function () {
    describe("login", function () {
        it("should return an error object if no data is provided", async function () {
            const result = await UserService.login({ email: null, password: null });

            expect(result).to.be.an("object");
            expect(result).to.has.property('err');
            expect(result.err).to.be.an('error');
            expect(result.err.message).to.equal("No Data Provided");
        });

        it("should return an error object if email is not provided", async function () {
            const result = await UserService.login({ email: null, password: "samplePass" });

            expect(result).to.be.an("object");
            expect(result).to.has.property('err');
            expect(result.err).to.be.an('error');
            expect(result.err.message).to.equal("No Data Provided");
        });

        it("should return an error object if password is not provided", async function () {
            const result = await UserService.login({ email: "sample@email.com", password: null });

            expect(result).to.be.an("object");
            expect(result).to.has.property('err');
            expect(result.err).to.be.an('error');
            expect(result.err.message).to.equal("No Data Provided");
        });

        it("should return an error object if the email is not registered in database", async function () {
            sinon.stub(UsersDAL, 'getByEmail');
            UsersDAL.getByEmail.returns(null);

            const result = await UserService.login({ email: "Sample@email.com", password: "SamplePassword" });

            expect(result).to.be.an("object");
            expect(result).to.has.property('err');
            expect(result.err).to.be.an('error');
            expect(result.err.message).to.equal("No user registered with this email");
            UsersDAL.getByEmail.restore();
        });

        it("should return an error object if verify_account_token is not null on the user object", async function () {
            let returnUser = {
                verify_account_token: "a sample token here"
            };

            sinon.stub(UsersDAL, 'getByEmail');
            UsersDAL.getByEmail.returns(returnUser);

            const result = await UserService.login({ email: "Sample@email.com", password: "SamplePassword" });

            expect(result).to.be.an("object");
            expect(result).to.has.property('err');
            expect(result.err).to.be.an('error');
            expect(result.err.message).to.equal("You need to verify your account");
            UsersDAL.getByEmail.restore();
        });

        it("should return an error object if verify_account_expire is not null on the user object", async function () {
            let returnUser = {
                verify_account_expire: 8000
            };

            sinon.stub(UsersDAL, 'getByEmail');
            UsersDAL.getByEmail.returns(returnUser);

            const result = await UserService.login({ email: "Sample@email.com", password: "SamplePassword" });

            expect(result).to.be.an("object");
            expect(result).to.has.property('err');
            expect(result.err).to.be.an('error');
            expect(result.err.message).to.equal("You need to verify your account");
            UsersDAL.getByEmail.restore();
        });

        it("should return an error object if the hashing process goes wrong", async function () {
            let returnUser = {
                password: "samplePass"
            };

            sinon.stub(UsersDAL, 'getByEmail');
            UsersDAL.getByEmail.returns(returnUser);

            sinon.stub(bcrypt, 'compare');
            bcrypt.compare.returns(false);

            const result = await UserService.login({ email: "Sample@email.com", password: "samplePass" });

            expect(result).to.be.an("object");
            expect(result).to.has.property('err');
            expect(result.err).to.be.an('error');
            expect(result.err.message).to.equal("Wrong Credentials");
            UsersDAL.getByEmail.restore();
            bcrypt.compare.restore();
        });

        it("should return the an object with the token and the user object if login process goes right", async function () {
            let returnUser = {
                email: "sample@email.com",
                password: "samplePass"
            };

            sinon.stub(UsersDAL, 'getByEmail');
            UsersDAL.getByEmail.returns(returnUser);

            sinon.stub(bcrypt, 'compare');
            bcrypt.compare.returns(true);

            sinon.stub(jwt, 'sign');
            jwt.sign.returns('sample_token');

            const result = await UserService.login({ email: "Sample@email.com", password: "samplePass" });

            expect(result).to.be.an("object");
            expect(result).to.have.property('token');
            expect(result).to.have.property('user');
            expect(result.token).to.equal("sample_token");
            expect(result.user).to.have.property("email");
            expect(result.user).to.have.property("password");

            UsersDAL.getByEmail.restore();
            bcrypt.compare.restore();
            jwt.sign.restore();
        });
    });
});