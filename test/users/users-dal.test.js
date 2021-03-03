const expect = require('chai').expect;
const sinon = require('sinon');

const User = require('../../src/users').User;
const UsersDAL = require('../../src/users').UsersDAL

describe("User DAL", function () {
    describe("getByEmail", function () {
        it("should return false if no email is provided", function () {
            expect(UsersDAL.getByEmail()).to.be.false;
        });

        it("should return a promise object if email is provided", function () {
            sinon.stub(User, 'findOne');
            User.findOne.returns(
                new Promise((resolve, reject) => {
                    resolve();
                })
            );

            expect(UsersDAL.getByEmail("test1@test1.com")).to.be.a("promise");

            User.findOne.restore();
        });
    });

    describe("saveUser", function () {
        it("should return false if username is not provided", function () {
            let userInfo = {
                email: "test1@test1.com",
                password: "password",
                verification_token: "the_token",
                verification_token_expire: 8000
            }

            expect(UsersDAL.saveUser(userInfo)).to.be.false;
        });

        it("should return false if email is not provided", function () {
            let userInfo = {
                username: "test1",
                password: "password",
                verification_token: "the_token",
                verification_token_expire: 8000
            }

            expect(UsersDAL.saveUser(userInfo)).to.be.false;
        });

        it("should return false if password is not provided", function () {
            let userInfo = {
                email: "test1@test1.com",
                username: "test1",
                verification_token: "the_token",
                verification_token_expire: 8000
            }

            expect(UsersDAL.saveUser(userInfo)).to.be.false;
        });

        it("should return false if verification token is not provided", function () {
            let userInfo = {
                email: "test1@test1.com",
                username: "test1",
                password: "password",
                verification_token_expire: 8000
            }

            expect(UsersDAL.saveUser(userInfo)).to.be.false;
        });

        it("should return false if verification token expire date is not provided", function () {
            let userInfo = {
                email: "test1@test1.com",
                username: "test1",
                password: "password",
                verification_token: "the_token",
            }

            expect(UsersDAL.saveUser(userInfo)).to.be.false;
        });

        it("should return a promise if all the information is provided", function () {
            let userInfo = {
                email: "test1@test1.com",
                username: "test1",
                password: "password",
                verification_token: "the_token",
                verification_token_expire: 8000
            }

            expect(UsersDAL.saveUser(userInfo)).to.be.a("promise");
        });
    });

    describe("getByVerificationToken", function () {
        it("should return false if the token is not provided", function () {
            expect(UsersDAL.getByVerificationToken()).to.be.false;
        });
        it("should return a promise if the token is provided", function () {
            const token = "some_dummy_token";

            sinon.stub(User, 'findOne');
            User.findOne.returns(new Promise((resolve) => {
                resolve();
            }));

            expect(UsersDAL.getByVerificationToken(token)).to.be.a("promise");

            User.findOne.restore();
        });
    });

    describe("getByResetToken", function () {
        it("should return false if no reset token is provided", function () {
            expect(UsersDAL.getByResetToken()).to.be.false;
        });
        it("should return a promise if reset token is provided", function () {
            let token = "some_dummy_token";

            sinon.stub(User, 'findOne');
            User.findOne.returns(new Promise((resolve) => {
                resolve();
            }));

            expect(UsersDAL.getByResetToken(token)).to.be.a("promise");

            User.findOne.restore();
        });
    });

    describe("validateVerifyToken", function () {
        it("should return false if no user is provided", function () {
            expect(UsersDAL.validateVerifyToken()).to.be.false;
        });
        it("should return a promise if user is provided", function () {
            let user = {
                verify_account_token: "some_token",
                verify_account_expire: 2000,
                save: function () {
                    return new Promise((resolve) => {
                        resolve();
                    });
                }
            }

            expect(UsersDAL.validateVerifyToken(user)).to.be.a("promise");
        });
        it("should set verify_account_token property of user to null", function () {
            let user = {
                verify_account_token: "some_token",
                verify_account_expire: 2000,
                save: function () { }
            };

            UsersDAL.validateVerifyToken(user);

            expect(user.verify_account_token).to.equal(null);
        });
        it("should set verify_account_expire property of user to null", function () {
            let user = {
                verify_account_token: "some_token",
                verify_account_expire: 2000,
                save: function () { }
            };

            UsersDAL.validateVerifyToken(user);

            expect(user.verify_account_expire).to.equal(null);
        });
    });
});